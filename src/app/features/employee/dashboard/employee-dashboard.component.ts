import { Component, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';
import { LeaveTableComponent } from '../../../shared/components/leave-table/leave-table.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [SummaryCardComponent, LeaveTableComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
})
export class EmployeeDashboardComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);

  user = this.auth.getCurrentUser()!;
  leaveTypes = signal<LeaveType[]>([]);
  requests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  recentRequests = computed(() =>
    [...this.requests()]
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
      .slice(0, 5)
  );

  constructor() {
    forkJoin({
      types: this.leaveService.getLeaveTypes(),
      requests: this.leaveService.getRequestsByUser(this.user.id),
    }).subscribe(({ types, requests }) => {
      this.leaveTypes.set(types);
      this.requests.set(requests);
      this.loading.set(false);
    });
  }

  balanceFor(type: LeaveType): number {
    return this.leaveService.calculateBalance(type, this.requests());
  }
}