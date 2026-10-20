package leave_management_backend.service;

import leave_management_backend.dto.ReportSummaryDTO;
import leave_management_backend.entity.LeaveRequest;
import leave_management_backend.repository.LeaveRequestRepository;
import leave_management_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final LeaveRequestRepository leaveRepo;
    private final UserRepository userRepo;

    public ReportService(LeaveRequestRepository leaveRepo, UserRepository userRepo) {
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
    }

    public ReportSummaryDTO getSummary() {
        List<LeaveRequest> all = leaveRepo.findAll();

        ReportSummaryDTO dto = new ReportSummaryDTO();
        dto.setTotalEmployees(userRepo.findAll().stream()
                .filter(u -> "EMPLOYEE".equals(u.getRole()))
                .count());
        dto.setTotalRequests(all.size());
        dto.setPendingCount(countStatus(all, "PENDING"));
        dto.setApprovedCount(countStatus(all, "APPROVED"));
        dto.setRejectedCount(countStatus(all, "REJECTED"));
        dto.setCancelledCount(countStatus(all, "CANCELLED"));

        Map<String, Long> byType = new TreeMap<>();
        Map<String, Long> byDept = new TreeMap<>();
        for (LeaveRequest r : all) {
            byType.merge(r.getLeaveType().getName(), 1L, Long::sum);
            byDept.merge(r.getUser().getDepartment(), 1L, Long::sum);
        }
        dto.setRequestsByLeaveType(byType);
        dto.setRequestsByDepartment(byDept);
        return dto;
    }

    private long countStatus(List<LeaveRequest> list, String status) {
        return list.stream().filter(r -> status.equals(r.getStatus())).count();
    }
}