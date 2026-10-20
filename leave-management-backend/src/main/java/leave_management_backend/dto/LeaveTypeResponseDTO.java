package leave_management_backend.dto;

public class LeaveTypeResponseDTO {

    private Long leaveTypeId;
    private String name;
    private Integer maxDays;
    private Boolean active;

    public LeaveTypeResponseDTO() {
    }

    public LeaveTypeResponseDTO(Long leaveTypeId, String name, Integer maxDays, Boolean active) {
        this.leaveTypeId = leaveTypeId;
        this.name = name;
        this.maxDays = maxDays;
        this.active = active;
    }

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMaxDays() {
        return maxDays;
    }

    public void setMaxDays(Integer maxDays) {
        this.maxDays = maxDays;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}