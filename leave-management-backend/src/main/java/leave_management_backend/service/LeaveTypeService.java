package leave_management_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import leave_management_backend.dto.LeaveTypePatchDTO;
import leave_management_backend.dto.LeaveTypeRequestDTO;
import leave_management_backend.dto.LeaveTypeResponseDTO;
import leave_management_backend.entity.LeaveType;
import leave_management_backend.exception.ResourceNotFoundException;
import leave_management_backend.repository.LeaveRequestRepository;
import leave_management_backend.repository.LeaveTypeRepository;

@Service
public class LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveTypeService(LeaveTypeRepository leaveTypeRepository,
                            LeaveRequestRepository leaveRequestRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }
    
    
    public LeaveTypeResponseDTO patchLeaveType(Long id, LeaveTypePatchDTO dto) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found with id: " + id));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            leaveTypeRepository.findByName(dto.getName())
                    .filter(other -> !other.getLeaveTypeId().equals(id))
                    .ifPresent(other -> {
                        throw new IllegalArgumentException("Leave type already exists: " + dto.getName());
                    });
            leaveType.setName(dto.getName());
        }
        if (dto.getMaxDays() != null) {
            if (dto.getMaxDays() < 1) {
                throw new IllegalArgumentException("Max days must be at least 1");
            }
            leaveType.setMaxDays(dto.getMaxDays());
        }
        if (dto.getActive() != null) {
            leaveType.setActive(dto.getActive());
        }
        return toResponseDTO(leaveTypeRepository.save(leaveType));
    }

    public void deleteLeaveType(Long id) {
        if (!leaveTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Leave type not found with id: " + id);
        }
        if (leaveRequestRepository.existsByLeaveType_LeaveTypeId(id)) {
            throw new IllegalArgumentException(
                    "Cannot delete: leave requests exist for this type. Deactivate it instead.");
        }
        leaveTypeRepository.deleteById(id);
    }
    public List<LeaveTypeResponseDTO> getAllLeaveTypes() {
        return leaveTypeRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveTypeResponseDTO> getActiveLeaveTypes() {
        return leaveTypeRepository.findByActiveTrue()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public LeaveTypeResponseDTO getLeaveTypeById(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found with id: " + id));
        return toResponseDTO(leaveType);
    }

    public LeaveTypeResponseDTO createLeaveType(LeaveTypeRequestDTO dto) {
        if (leaveTypeRepository.findByName(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Leave type already exists: " + dto.getName());
        }
        LeaveType leaveType = new LeaveType(dto.getName(), dto.getMaxDays(), dto.getActive());
        LeaveType saved = leaveTypeRepository.save(leaveType);
        return toResponseDTO(saved);
    }

    public LeaveTypeResponseDTO updateLeaveType(Long id, LeaveTypeRequestDTO dto) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found with id: " + id));

        leaveType.setName(dto.getName());
        leaveType.setMaxDays(dto.getMaxDays());
        if (dto.getActive() != null) {
            leaveType.setActive(dto.getActive());
        }

        LeaveType updated = leaveTypeRepository.save(leaveType);
        return toResponseDTO(updated);
    }

    public LeaveTypeResponseDTO toggleActive(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found with id: " + id));
        leaveType.setActive(!leaveType.getActive());
        LeaveType updated = leaveTypeRepository.save(leaveType);
        return toResponseDTO(updated);
    }

    private LeaveTypeResponseDTO toResponseDTO(LeaveType leaveType) {
        return new LeaveTypeResponseDTO(
                leaveType.getLeaveTypeId(),
                leaveType.getName(),
                leaveType.getMaxDays(),
                leaveType.getActive()
        );
    }
}