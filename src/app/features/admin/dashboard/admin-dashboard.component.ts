import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveService } from '../../../core/services/leave.service';
import { User } from '../../../core/models/user.model';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SummaryCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private leaveService = inject(LeaveService);

  admin = this.auth.getCurrentUser()!;
  users = signal<User[]>([]);
  requests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  activeEmployees = computed(() => this.users().filter((u) => u.active).length);
  pendingCount = computed(() => this.requests().filter((r) => r.status === 'PENDING').length);
  approvedCount = computed(() => this.requests().filter((r) => r.status === 'APPROVED').length);

  constructor() {
    this.userService.getAllUsers().subscribe((allUsers) => {
      this.users.set(allUsers);
      this.loading.set(false);
      const allIds = allUsers.map((u) => u.id);
      this.leaveService.getRequestsByManager(allIds).subscribe((requests) => this.requests.set(requests));
    });
  }
}