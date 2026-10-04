import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { User } from '../../../core/models/user.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [SummaryCardComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css',
})
export class ManagerDashboardComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);

  manager = this.auth.getCurrentUser()!;
  teamMembers = signal<User[]>([]);
  teamRequests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  pendingCount = computed(() => this.teamRequests().filter((r) => r.status === 'PENDING').length);
  approvedCount = computed(() => this.teamRequests().filter((r) => r.status === 'APPROVED').length);
  rejectedCount = computed(() => this.teamRequests().filter((r) => r.status === 'REJECTED').length);

  constructor() {
    this.userService.getTeamMembers(this.manager.id).subscribe((members) => {
      this.teamMembers.set(members);
      const memberIds = members.map((m) => m.id);
      this.leaveService.getRequestsByManager(memberIds).subscribe((requests) => {
        this.teamRequests.set(requests);
        this.loading.set(false);
      });
    });
  }
}