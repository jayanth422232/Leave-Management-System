import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-leave-details',
  standalone: true,
  imports: [DatePipe, MatCardModule, MatButtonModule, StatusBadgeComponent, RouterLink],
  templateUrl: './leave-details.component.html',
  styleUrl: './leave-details.component.css',
})
export class LeaveDetailsComponent {
  private route = inject(ActivatedRoute);
  private leaveService = inject(LeaveService);
  router = inject(Router);

  request = signal<LeaveRequest | null>(null);
  leaveTypes = signal<LeaveType[]>([]);
  loading = signal(true);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    this.leaveService.getRequestById(id).subscribe((req) => {
      this.request.set(req);
      this.loading.set(false);
    });
  }

  typeName(id: number): string {
    return this.leaveTypes().find((t) => t.id === id)?.name ?? '—';
  }

  // which timeline steps are "reached" for the current status
  timelineSteps(): { label: string; done: boolean }[] {
    const status = this.request()?.status;
    if (status === 'REJECTED') {
      return [
        { label: 'Applied', done: true },
        { label: 'Rejected', done: true },
      ];
    }
    if (status === 'CANCELLED') {
      return [
        { label: 'Applied', done: true },
        { label: 'Cancelled', done: true },
      ];
    }
    return [
      { label: 'Applied', done: true },
      { label: 'Manager Approved', done: status === 'APPROVED' },
      { label: 'Completed', done: status === 'APPROVED' },
    ];
  }
}