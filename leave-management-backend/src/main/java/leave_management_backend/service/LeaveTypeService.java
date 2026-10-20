package leave_management_backend.service;

import leave_management_backend.dto.LeaveTypeRequestDTO;
import leave_management_backend.dto.LeaveTypeResponseDTO;
import leave_management_backend.entity.LeaveType;
import leave_management_backend.exception.ResourceNotFoundException;
import leave_management_backend.repository.LeaveTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveTypeService(LeaveTypeRepository leaveTypeRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
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