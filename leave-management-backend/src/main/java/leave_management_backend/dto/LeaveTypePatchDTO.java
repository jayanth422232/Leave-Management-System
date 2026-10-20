package leave_management_backend.dto;

public class LeaveTypePatchDTO {

    private String name;
    private Integer maxDays;
    private Boolean active;

    public LeaveTypePatchDTO() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getMaxDays() { return maxDays; }
    public void setMaxDays(Integer maxDays) { this.maxDays = maxDays; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}