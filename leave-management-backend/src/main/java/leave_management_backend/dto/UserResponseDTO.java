package leave_management_backend.dto;

public class UserResponseDTO {

    private Long userId;
    private String name;
    private String email;
    private String role;
    private String department;
    private Long managerId;
    private Boolean active;

    public UserResponseDTO() {
    }

    public UserResponseDTO(Long userId, String name, String email, String role,
                            String department, Long managerId, Boolean active) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.managerId = managerId;
        this.active = active;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}