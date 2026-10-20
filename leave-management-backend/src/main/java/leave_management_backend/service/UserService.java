package leave_management_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import leave_management_backend.dto.LoginRequestDTO;
import leave_management_backend.dto.UserCreateRequestDTO;
import leave_management_backend.dto.UserResponseDTO;
import leave_management_backend.entity.User;
import leave_management_backend.exception.ResourceNotFoundException;
import leave_management_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalArgumentException("Your account is deactivated");
        }
        return toResponseDTO(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponseDTO(user);
    }

    public List<UserResponseDTO> getTeamMembers(Long managerId) {
        return userRepository.findByManager_UserId(managerId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO createUser(UserCreateRequestDTO request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already in use: " + request.getEmail());
        });

        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Manager not found with id: " + request.getManagerId()));
        }

        User user = new User(
                request.getName(), request.getEmail(), request.getPassword(),
                request.getRole(), request.getDepartment(), manager, true);

        return toResponseDTO(userRepository.save(user));
    }

    public UserResponseDTO updateUser(Long id, UserCreateRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword());
        }
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Manager not found with id: " + request.getManagerId()));
            user.setManager(manager);
        } else {
            user.setManager(null);
        }

        return toResponseDTO(userRepository.save(user));
    }

    public UserResponseDTO toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        return toResponseDTO(userRepository.save(user));
    }

    private UserResponseDTO toResponseDTO(User user) {
        Long managerId = user.getManager() != null ? user.getManager().getUserId() : null;
        return new UserResponseDTO(user.getUserId(), user.getName(), user.getEmail(),
                user.getRole(), user.getDepartment(), managerId, user.getActive());
    }
}