package leave_management_backend.controller;

import jakarta.validation.Valid;
import leave_management_backend.dto.LeaveTypeRequestDTO;
import leave_management_backend.dto.LeaveTypeResponseDTO;
import leave_management_backend.service.LeaveTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    public LeaveTypeController(LeaveTypeService leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }

    @GetMapping
    public ResponseEntity<List<LeaveTypeResponseDTO>> getAllLeaveTypes() {
        return ResponseEntity.ok(leaveTypeService.getAllLeaveTypes());
    }

    @GetMapping("/active")
    public ResponseEntity<List<LeaveTypeResponseDTO>> getActiveLeaveTypes() {
        return ResponseEntity.ok(leaveTypeService.getActiveLeaveTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveTypeResponseDTO> getLeaveTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveTypeService.getLeaveTypeById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveTypeResponseDTO> createLeaveType(@Valid @RequestBody LeaveTypeRequestDTO dto) {
        LeaveTypeResponseDTO created = leaveTypeService.createLeaveType(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveTypeResponseDTO> updateLeaveType(
            @PathVariable Long id,
            @Valid @RequestBody LeaveTypeRequestDTO dto) {
        return ResponseEntity.ok(leaveTypeService.updateLeaveType(id, dto));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<LeaveTypeResponseDTO> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(leaveTypeService.toggleActive(id));
    }
}