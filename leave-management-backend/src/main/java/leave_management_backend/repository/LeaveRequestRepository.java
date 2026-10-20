package leave_management_backend.repository;

import leave_management_backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUser_UserIdOrderByAppliedOnDescRequestIdDesc(Long userId);

    List<LeaveRequest> findByStatusOrderByAppliedOnDescRequestIdDesc(String status);

    List<LeaveRequest> findByUser_Manager_UserIdOrderByAppliedOnDescRequestIdDesc(Long managerId);

    List<LeaveRequest> findByUser_Manager_UserIdAndStatusOrderByAppliedOnDescRequestIdDesc(Long managerId, String status);

    List<LeaveRequest> findAllByOrderByAppliedOnDescRequestIdDesc();

    @Query("SELECT COUNT(r) > 0 FROM LeaveRequest r " +
           "WHERE r.user.userId = :userId " +
           "AND r.status IN ('PENDING', 'APPROVED') " +
           "AND r.fromDate <= :toDate AND r.toDate >= :fromDate")
    boolean existsOverlap(@Param("userId") Long userId,
                          @Param("fromDate") LocalDate fromDate,
                          @Param("toDate") LocalDate toDate);

    @Query("SELECT COALESCE(SUM(r.days), 0) FROM LeaveRequest r " +
           "WHERE r.user.userId = :userId " +
           "AND r.leaveType.leaveTypeId = :leaveTypeId " +
           "AND r.status IN :statuses")
    Long sumDays(@Param("userId") Long userId,
                 @Param("leaveTypeId") Long leaveTypeId,
                 @Param("statuses") Collection<String> statuses);
}