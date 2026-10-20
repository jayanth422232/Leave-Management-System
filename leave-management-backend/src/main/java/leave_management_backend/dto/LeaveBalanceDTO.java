package leave_management_backend.dto;

public class LeaveBalanceDTO {

    private Long leaveTypeId;
    private String leaveTypeName;
    private Integer maxDays;
    private Long usedDays;
    private Long pendingDays;
    private Long remainingDays;

    public LeaveBalanceDTO() {
    }

    public LeaveBalanceDTO(Long leaveTypeId, String leaveTypeName, Integer maxDays,
                           Long usedDays, Long pendingDays, Long remainingDays) {
        this.leaveTypeId = leaveTypeId;
        this.leaveTypeName = leaveTypeName;
        this.maxDays = maxDays;
        this.usedDays = usedDays;
        this.pendingDays = pendingDays;
        this.remainingDays = remainingDays;
    }

    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }

    public String getLeaveTypeName() { return leaveTypeName; }
    public void setLeaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; }

    public Integer getMaxDays() { return maxDays; }
    public void setMaxDays(Integer maxDays) { this.maxDays = maxDays; }

    public Long getUsedDays() { return usedDays; }
    public void setUsedDays(Long usedDays) { this.usedDays = usedDays; }

    public Long getPendingDays() { return pendingDays; }
    public void setPendingDays(Long pendingDays) { this.pendingDays = pendingDays; }

    public Long getRemainingDays() { return remainingDays; }
    public void setRemainingDays(Long remainingDays) { this.remainingDays = remainingDays; }
}