import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-leave-table',
  standalone: true,
  imports: [MatTableModule, StatusBadgeComponent, DatePipe],
  templateUrl: './leave-table.component.html',
  styleUrl: './leave-table.component.css',
})
export class LeaveTableComponent {
  @Input({ required: true }) requests: LeaveRequest[] = [];
  @Input({ required: true }) leaveTypes: LeaveType[] = [];

  columns = ['type', 'from', 'to', 'days', 'status'];

  typeName(id: number): string {
    return this.leaveTypes.find((t) => t.id === id)?.name ?? '—';
  }
}