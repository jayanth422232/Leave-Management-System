import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { LeaveTableComponent } from '../../../shared/components/leave-table/leave-table.component';

@Component({
  selector: 'app-team-leaves',
  standalone: true,
  imports: [LeaveTableComponent],
  template: `
    <h2>Team Leaves</h2>
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      <app-leave-table [requests]="requests()" [leaveTypes]="leaveTypes()" />
    }
  `,
})
export class TeamLeavesComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);

  manager = this.auth.getCurrentUser()!;
  requests = signal<LeaveRequest[]>([]);
  leaveTypes = signal<LeaveType[]>([]);
  loading = signal(true);

  constructor() {
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    this.userService.getTeamMembers(this.manager.id).subscribe((members) => {
      const memberIds = members.map((m) => m.id);
      this.leaveService.getRequestsByManager(memberIds).subscribe((requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      });
    });
  }
}