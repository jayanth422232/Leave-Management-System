package leave_management_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "leave_types")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_type_id")
    private Long leaveTypeId;

    @NotBlank
    @Column(name = "name", nullable = false, length = 50, unique = true)
    private String name;

    @NotNull
    @Min(1)
    @Column(name = "max_days", nullable = false)
    private Integer maxDays;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    public LeaveType() {
    }

    public LeaveType(String name, Integer maxDays, Boolean active) {
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