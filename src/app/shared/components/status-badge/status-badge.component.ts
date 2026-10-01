import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { LeaveStatus } from '../../../core/models/leave-request.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `<span class="badge" [ngClass]="status.toLowerCase()">{{ status }}</span>`,
  styles: [`
    .badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .approved  { background: #e6f4ea; color: #1e7e34; }
    .pending   { background: #fff8e1; color: #8a6d00; }
    .rejected  { background: #fdecea; color: #c62828; }
    .cancelled { background: #eceff1; color: #546e7a; }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: LeaveStatus;
}