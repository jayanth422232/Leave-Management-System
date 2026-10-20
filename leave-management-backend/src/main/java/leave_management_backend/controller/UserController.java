package leave_management_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import leave_management_backend.dto.UserCreateRequestDTO;
import leave_management_backend.dto.UserPatchDTO;
import leave_management_backend.dto.UserResponseDTO;
import leave_management_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<UserResponseDTO>> getTeamMembers(@PathVariable Long managerId) {
        return ResponseEntity.ok(userService.getTeamMembers(managerId));
    }
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> patchUser(@PathVariable Long id,
                                                     @RequestBody UserPatchDTO dto) {
        return ResponseEntity.ok(userService.patchUser(id, dto));
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                        @Valid @RequestBody UserCreateRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<UserResponseDTO> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleActive(id));
    }
}