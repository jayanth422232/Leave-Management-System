package leave_management_backend.controller;

import jakarta.validation.Valid;
import leave_management_backend.dto.*;
import leave_management_backend.service.LeaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // ----- Employee -----

    @PostMapping
    public ResponseEntity<LeaveResponseDTO> apply(@Valid @RequestBody LeaveApplyRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.applyLeave(dto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LeaveResponseDTO>> myLeaves(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveService.getMyLeaves(userId));
    }

    @GetMapping("/balance/{userId}")
    public ResponseEntity<List<LeaveBalanceDTO>> balance(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveService.getBalance(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveById(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<LeaveResponseDTO> cancel(@PathVariable Long id,
                                                   @RequestParam Long userId) {
        return ResponseEntity.ok(leaveService.cancelLeave(id, userId));
    }

    // ----- Manager -----

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<LeaveResponseDTO>> teamLeaves(@PathVariable Long managerId) {
        return ResponseEntity.ok(leaveService.getTeamLeaves(managerId));
    }

    @GetMapping("/manager/{managerId}/pending")
    public ResponseEntity<List<LeaveResponseDTO>> pending(@PathVariable Long managerId) {
        return ResponseEntity.ok(leaveService.getPendingForManager(managerId));
    }

    @GetMapping("/manager/{managerId}/calendar")
    public ResponseEntity<List<LeaveResponseDTO>> calendar(@PathVariable Long managerId) {
        return ResponseEntity.ok(leaveService.getTeamCalendar(managerId));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<LeaveResponseDTO> approve(@PathVariable Long id,
                                                    @Valid @RequestBody LeaveReviewRequestDTO dto) {
        return ResponseEntity.ok(leaveService.approveLeave(id, dto));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<LeaveResponseDTO> reject(@PathVariable Long id,
                                                   @Valid @RequestBody LeaveReviewRequestDTO dto) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, dto));
    }

    // ----- Admin -----

    @GetMapping
    public ResponseEntity<List<LeaveResponseDTO>> all(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(leaveService.getAllLeaves(status));
    }
}