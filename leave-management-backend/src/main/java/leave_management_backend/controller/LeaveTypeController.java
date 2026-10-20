package leave_management_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import leave_management_backend.dto.LeaveTypePatchDTO;
import leave_management_backend.dto.LeaveTypeRequestDTO;
import leave_management_backend.dto.LeaveTypeResponseDTO;
import leave_management_backend.service.LeaveTypeService;

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
    
    @PatchMapping("/{id}")
    public ResponseEntity<LeaveTypeResponseDTO> patchLeaveType(@PathVariable Long id,
                                                               @RequestBody LeaveTypePatchDTO dto) {
        return ResponseEntity.ok(leaveTypeService.patchLeaveType(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveType(@PathVariable Long id) {
        leaveTypeService.deleteLeaveType(id);
        return ResponseEntity.noContent().build();
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