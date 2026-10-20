package leave_management_backend.dto;

public class UserPatchDTO {

    private String name;
    private String email;
    private String password;
    private String role;
    private String department;
    private Long managerId;
    private Boolean active;

    public UserPatchDTO() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}