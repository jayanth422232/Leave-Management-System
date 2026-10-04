import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './pending-approvals.component.html',
  styleUrl: './pending-approvals.component.css',
})
export class PendingApprovalsComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);
  private router = inject(Router);

  manager = this.auth.getCurrentUser()!;
  requests = signal<LeaveRequest[]>([]);
  teamMembers = signal<User[]>([]);
  leaveTypes = signal<LeaveType[]>([]);
  loading = signal(true);

  columns = ['employee', 'type', 'from', 'to', 'days', 'action'];

  constructor() {
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    this.userService.getTeamMembers(this.manager.id).subscribe((members) => {
      this.teamMembers.set(members);
      const memberIds = members.map((m) => m.id);
      this.leaveService.getRequestsByManager(memberIds).subscribe((requests) => {
        this.requests.set(requests.filter((r) => r.status === 'PENDING'));
        this.loading.set(false);
      });
    });
  }

  employeeName(userId: number): string {
    return this.teamMembers().find((m) => m.id === userId)?.name ?? '—';
  }

  typeName(id: number): string {
    return this.leaveTypes().find((t) => t.id === id)?.name ?? '—';
  }

  review(id: number): void {
    this.router.navigate(['/manager/review-leave', id]);
  }
}