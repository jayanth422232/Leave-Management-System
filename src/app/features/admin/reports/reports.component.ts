import { Component, inject, signal, computed } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { LeaveService } from '../../../core/services/leave.service';
import { User } from '../../../core/models/user.model';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SummaryCardComponent],
  template: `
    <h2>Reports</h2>
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      <h3>Overall</h3>
      <div class="cards-row">
        <app-summary-card label="Total Requests" [value]="requests().length" icon="list_alt" />
        <app-summary-card label="Approved" [value]="countByStatus('APPROVED')" icon="check_circle" />
        <app-summary-card label="Rejected" [value]="countByStatus('REJECTED')" icon="cancel" />
        <app-summary-card label="Pending" [value]="countByStatus('PENDING')" icon="pending_actions" />
      </div>

      <h3>By Department</h3>
      <div class="cards-row">
        @for (dept of departments(); track dept) {
          <app-summary-card [label]="dept" [value]="countByDepartment(dept)" icon="apartment" />
        }
      </div>
    }
  `,
  styles: [`
    .cards-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
    .cards-row app-summary-card { flex: 1 1 160px; }
    h3 { margin-top: 8px; }
  `],
})
export class ReportsComponent {
  private userService = inject(UserService);
  private leaveService = inject(LeaveService);

  users = signal<User[]>([]);
  requests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  departments = computed(() => [...new Set(this.users().map((u) => u.department))]);

  constructor() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users.set(users);
      const allIds = users.map((u) => u.id);
      this.leaveService.getRequestsByManager(allIds).subscribe((requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      });
    });
  }

  countByStatus(status: string): number {
    return this.requests().filter((r) => r.status === status).length;
  }

  countByDepartment(dept: string): number {
    const userIdsInDept = this.users().filter((u) => u.department === dept).map((u) => u.id);
    return this.requests().filter((r) => userIdsInDept.includes(r.userId)).length;
  }
}