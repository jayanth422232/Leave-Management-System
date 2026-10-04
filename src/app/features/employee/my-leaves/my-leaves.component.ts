import { Component, inject, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveRequest, LeaveStatus } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    DatePipe, StatusBadgeComponent,
  ],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.css',
})
export class MyLeavesComponent {
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private router = inject(Router);

  user = this.auth.getCurrentUser()!;
  leaveTypes = signal<LeaveType[]>([]);
  requests = signal<LeaveRequest[]>([]);
  loading = signal(true);

  columns = ['type', 'from', 'to', 'days', 'status', 'actions'];

  // filter state
  searchText = signal('');
  statusFilter = signal<LeaveStatus | 'ALL'>('ALL');
  typeFilter = signal<number | 'ALL'>('ALL');
  sortState = signal<Sort>({ active: 'fromDate', direction: 'desc' });
  pageIndex = signal(0);
  pageSize = signal(5);

  // the full pipeline: filter -> search -> sort, recalculated whenever any signal changes
  filteredSorted = computed(() => {
    let data = this.requests();

    if (this.statusFilter() !== 'ALL') {
      data = data.filter((r) => r.status === this.statusFilter());
    }
    if (this.typeFilter() !== 'ALL') {
      data = data.filter((r) => r.leaveTypeId === this.typeFilter());
    }
    const term = this.searchText().trim().toLowerCase();
    if (term) {
      data = data.filter((r) => {
        const typeName = this.typeName(r.leaveTypeId).toLowerCase();
        return typeName.includes(term) || r.reason.toLowerCase().includes(term);
      });
    }

    const { active, direction } = this.sortState();
    if (direction) {
      data = [...data].sort((a, b) => {
        let cmp = 0;
        if (active === 'fromDate') cmp = a.fromDate.localeCompare(b.fromDate);
        else if (active === 'days') cmp = a.days - b.days;
        else if (active === 'status') cmp = a.status.localeCompare(b.status);
        return direction === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  });

  // the current page slice shown in the table
  pagedRequests = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredSorted().slice(start, start + this.pageSize());
  });

  constructor() {
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.leaveService.getRequestsByUser(this.user.id).subscribe((requests) => {
      this.requests.set(requests);
      this.loading.set(false);
    });
  }

  typeName(id: number): string {
    return this.leaveTypes().find((t) => t.id === id)?.name ?? '—';
  }

  onSortChange(sort: Sort): void {
    this.sortState.set(sort);
  }

  onPageChange(index: number, size: number): void {
    this.pageIndex.set(index);
    this.pageSize.set(size);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/employee/my-leaves', id]);
  }

  cancelRequest(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Cancel this leave request?')) return;
    this.leaveService.cancelLeave(id).subscribe(() => this.refresh());
  }
}