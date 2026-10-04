import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { User } from '../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DayCell {
  date: number | null;      // null for blank padding cells
  isoDate: string;          // "YYYY-MM-DD"
  onLeaveNames: string[];
  isToday: boolean;
}

@Component({
  selector: 'app-team-calendar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './team-calendar.component.html',
  styleUrl: './team-calendar.component.css',
})
export class TeamCalendarComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);

  manager = this.auth.getCurrentUser()!;
  teamMembers = signal<User[]>([]);
  approvedRequests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  viewDate = signal(new Date()); // the month currently displayed
  selectedDate = signal<string | null>(null);

  monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  weeks = computed<DayCell[][]>(() => {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // JS getDay(): 0=Sun..6=Sat. We want Monday-first, so shift it.
    const startOffset = (firstDay.getDay() + 6) % 7;
    const todayIso = this.toIso(new Date());

    const cells: DayCell[] = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null, isoDate: '', onLeaveNames: [], isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = this.toIso(new Date(year, month, d));
      cells.push({
        date: d,
        isoDate: iso,
        onLeaveNames: this.namesOnLeave(iso),
        isToday: iso === todayIso,
      });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, isoDate: '', onLeaveNames: [], isToday: false });
    }

    const result: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  });

  selectedDayPeople = computed(() => {
    const date = this.selectedDate();
    return date ? this.namesOnLeave(date) : [];
  });

  constructor() {
    this.userService.getTeamMembers(this.manager.id).subscribe((members) => {
      this.teamMembers.set(members);
      const memberIds = members.map((m) => m.id);
      this.leaveService.getRequestsByManager(memberIds).subscribe((requests) => {
        this.approvedRequests.set(requests.filter((r) => r.status === 'APPROVED'));
        this.loading.set(false);
      });
    });
  }

  private namesOnLeave(iso: string): string[] {
    return this.approvedRequests()
      .filter((r) => iso >= r.fromDate && iso <= r.toDate)
      .map((r) => this.teamMembers().find((m) => m.id === r.userId)?.name ?? 'Unknown');
  }

  private toIso(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    this.selectedDate.set(null);
  }

  nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    this.selectedDate.set(null);
  }

  selectDay(cell: DayCell): void {
    if (cell.date === null) return;
    this.selectedDate.set(cell.isoDate === this.selectedDate() ? null : cell.isoDate);
  }
}