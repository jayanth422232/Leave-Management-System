package leave_management_backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LeaveReviewRequestDTO {

    @NotNull
    private Long managerId;

    @Size(max = 500)
    private String managerComment;

    public LeaveReviewRequestDTO() {
    }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getManagerComment() { return managerComment; }
    public void setManagerComment(String managerComment) { this.managerComment = managerComment; }
}