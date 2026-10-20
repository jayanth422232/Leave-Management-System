package leave_management_backend.service;

import leave_management_backend.dto.*;
import leave_management_backend.entity.LeaveRequest;
import leave_management_backend.entity.LeaveType;
import leave_management_backend.entity.User;
import leave_management_backend.exception.ResourceNotFoundException;
import leave_management_backend.repository.LeaveRequestRepository;
import leave_management_backend.repository.LeaveTypeRepository;
import leave_management_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class LeaveService {

    private static final String PENDING = "PENDING";
    private static final String APPROVED = "APPROVED";
    private static final String REJECTED = "REJECTED";
    private static final String CANCELLED = "CANCELLED";

    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepo;
    private final LeaveTypeRepository leaveTypeRepo;

    public LeaveService(LeaveRequestRepository leaveRepo,
                        UserRepository userRepo,
                        LeaveTypeRepository leaveTypeRepo) {
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
        this.leaveTypeRepo = leaveTypeRepo;
    }

    // ---------- EMPLOYEE ----------

    @Transactional
    public LeaveResponseDTO applyLeave(LeaveApplyRequestDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalArgumentException("Inactive users cannot apply for leave");
        }

        LeaveType type = leaveTypeRepo.findById(dto.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found with id: " + dto.getLeaveTypeId()));
        if (!Boolean.TRUE.equals(type.getActive())) {
            throw new IllegalArgumentException("This leave type is not active");
        }

        if (dto.getToDate().isBefore(dto.getFromDate())) {
            throw new IllegalArgumentException("To date cannot be before from date");
        }
        if (dto.getFromDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot apply for leave in the past");
        }

        int days = (int) ChronoUnit.DAYS.between(dto.getFromDate(), dto.getToDate()) + 1;

        if (leaveRepo.existsOverlap(user.getUserId(), dto.getFromDate(), dto.getToDate())) {
            throw new IllegalArgumentException("You already have a pending or approved leave overlapping these dates");
        }

        long booked = leaveRepo.sumDays(user.getUserId(), type.getLeaveTypeId(), List.of(PENDING, APPROVED));
        if (booked + days > type.getMaxDays()) {
            long remaining = type.getMaxDays() - booked;
            throw new IllegalArgumentException("Insufficient balance for " + type.getName()
                    + ". Requested: " + days + ", remaining: " + remaining);
        }

        LeaveRequest req = new LeaveRequest();
        req.setUser(user);
        req.setLeaveType(type);
        req.setFromDate(dto.getFromDate());
        req.setToDate(dto.getToDate());
        req.setDays(days);
        req.setReason(dto.getReason());
        req.setStatus(PENDING);
        req.setAppliedOn(LocalDate.now());

        return toDTO(leaveRepo.save(req));
    }

    public List<LeaveResponseDTO> getMyLeaves(Long userId) {
        ensureUserExists(userId);
        return toDTOList(leaveRepo.findByUser_UserIdOrderByAppliedOnDescRequestIdDesc(userId));
    }

    public LeaveResponseDTO getLeaveById(Long id) {
        return toDTO(findRequest(id));
    }

    @Transactional
    public LeaveResponseDTO cancelLeave(Long id, Long userId) {
        LeaveRequest req = findRequest(id);
        if (!req.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own leave requests");
        }
        if (!PENDING.equals(req.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be cancelled");
        }
        req.setStatus(CANCELLED);
        return toDTO(leaveRepo.save(req));
    }

    public List<LeaveBalanceDTO> getBalance(Long userId) {
        ensureUserExists(userId);
        return leaveTypeRepo.findByActiveTrue().stream().map(type -> {
            long used = leaveRepo.sumDays(userId, type.getLeaveTypeId(), List.of(APPROVED));
            long pending = leaveRepo.sumDays(userId, type.getLeaveTypeId(), List.of(PENDING));
            long remaining = type.getMaxDays() - used - pending;
            return new LeaveBalanceDTO(type.getLeaveTypeId(), type.getName(),
                    type.getMaxDays(), used, pending, remaining);
        }).collect(Collectors.toList());
    }

    // ---------- MANAGER ----------

    public List<LeaveResponseDTO> getTeamLeaves(Long managerId) {
        ensureUserExists(managerId);
        return toDTOList(leaveRepo.findByUser_Manager_UserIdOrderByAppliedOnDescRequestIdDesc(managerId));
    }

    public List<LeaveResponseDTO> getPendingForManager(Long managerId) {
        ensureUserExists(managerId);
        return toDTOList(leaveRepo
                .findByUser_Manager_UserIdAndStatusOrderByAppliedOnDescRequestIdDesc(managerId, PENDING));
    }

    public List<LeaveResponseDTO> getTeamCalendar(Long managerId) {
        ensureUserExists(managerId);
        return toDTOList(leaveRepo
                .findByUser_Manager_UserIdAndStatusOrderByAppliedOnDescRequestIdDesc(managerId, APPROVED));
    }

    @Transactional
    public LeaveResponseDTO approveLeave(Long id, LeaveReviewRequestDTO dto) {
        return review(id, dto, APPROVED);
    }

    @Transactional
    public LeaveResponseDTO rejectLeave(Long id, LeaveReviewRequestDTO dto) {
        if (dto.getManagerComment() == null || dto.getManagerComment().isBlank()) {
            throw new IllegalArgumentException("A comment is required when rejecting a request");
        }
        return review(id, dto, REJECTED);
    }

    private LeaveResponseDTO review(Long id, LeaveReviewRequestDTO dto, String newStatus) {
        LeaveRequest req = findRequest(id);

        User employee = req.getUser();
        Long employeesManagerId = employee.getManager() != null ? employee.getManager().getUserId() : null;
        if (employeesManagerId == null || !employeesManagerId.equals(dto.getManagerId())) {
            throw new IllegalArgumentException("Only the employee's manager can review this request");
        }
        if (!PENDING.equals(req.getStatus())) {
            throw new IllegalArgumentException("Only PENDING requests can be reviewed");
        }

        req.setStatus(newStatus);
        req.setManagerComment(dto.getManagerComment());
        return toDTO(leaveRepo.save(req));
    }

    // ---------- ADMIN ----------

    public List<LeaveResponseDTO> getAllLeaves(String status) {
        if (status == null || status.isBlank()) {
            return toDTOList(leaveRepo.findAllByOrderByAppliedOnDescRequestIdDesc());
        }
        return toDTOList(leaveRepo.findByStatusOrderByAppliedOnDescRequestIdDesc(status.toUpperCase()));
    }

    // ---------- helpers ----------

    private LeaveRequest findRequest(Long id) {
        return leaveRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
    }

    private void ensureUserExists(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }

    private List<LeaveResponseDTO> toDTOList(List<LeaveRequest> list) {
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LeaveResponseDTO toDTO(LeaveRequest r) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setRequestId(r.getRequestId());
        dto.setUserId(r.getUser().getUserId());
        dto.setUserName(r.getUser().getName());
        dto.setDepartment(r.getUser().getDepartment());
        dto.setLeaveTypeId(r.getLeaveType().getLeaveTypeId());
        dto.setLeaveTypeName(r.getLeaveType().getName());
        dto.setFromDate(r.getFromDate());
        dto.setToDate(r.getToDate());
        dto.setDays(r.getDays());
        dto.setReason(r.getReason());
        dto.setStatus(r.getStatus());
        dto.setManagerComment(r.getManagerComment());
        dto.setAppliedOn(r.getAppliedOn());
        return dto;
    }
}