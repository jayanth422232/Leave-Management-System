package leave_management_backend.dto;

import java.util.Map;

public class ReportSummaryDTO {

    private long totalEmployees;
    private long totalRequests;
    private long pendingCount;
    private long approvedCount;
    private long rejectedCount;
    private long cancelledCount;
    private Map<String, Long> requestsByLeaveType;
    private Map<String, Long> requestsByDepartment;

    public ReportSummaryDTO() {
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }

    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }

    public long getApprovedCount() { return approvedCount; }
    public void setApprovedCount(long approvedCount) { this.approvedCount = approvedCount; }

    public long getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(long rejectedCount) { this.rejectedCount = rejectedCount; }

    public long getCancelledCount() { return cancelledCount; }
    public void setCancelledCount(long cancelledCount) { this.cancelledCount = cancelledCount; }

    public Map<String, Long> getRequestsByLeaveType() { return requestsByLeaveType; }
    public void setRequestsByLeaveType(Map<String, Long> requestsByLeaveType) { this.requestsByLeaveType = requestsByLeaveType; }

    public Map<String, Long> getRequestsByDepartment() { return requestsByDepartment; }
    public void setRequestsByDepartment(Map<String, Long> requestsByDepartment) { this.requestsByDepartment = requestsByDepartment; }
}