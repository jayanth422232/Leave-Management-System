import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="summary-card">
      <mat-icon class="icon">{{ icon }}</mat-icon>
      <div class="value">{{ value }}</div>
      <div class="label">{{ label }}</div>
    </mat-card>
  `,
  styles: [`
    .summary-card { text-align: center; padding: 16px; }
    .icon { font-size: 32px; height: 32px; width: 32px; color: #3f51b5; }
    .value { font-size: 28px; font-weight: 700; margin-top: 8px; }
    .label { color: #666; font-size: 14px; }
  `],
})
export class SummaryCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number | string;
  @Input() icon: string = 'info';
}