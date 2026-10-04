import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveType } from '../../../core/models/leave-type.model';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { SummaryCardComponent } from '../../../shared/components/summary-card/summary-card.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [SummaryCardComponent],
  template: `
    <h2>Leave Balance</h2>
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      <div class="cards-row">
        @for (type of leaveTypes(); track type.id) {
          <app-summary-card [label]="type.name" [value]="balanceFor(type) + ' / ' + type.maxDays" icon="event_available" />
        }
      </div>
    }
  `,
  styles: [`
    .cards-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .cards-row app-summary-card { flex: 1 1 180px; }
  `],
})
export class LeaveBalanceComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);

  user = this.auth.getCurrentUser()!;
  leaveTypes = signal<LeaveType[]>([]);
  requests = signal<LeaveRequest[]>([]);
  loading = signal(true);

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