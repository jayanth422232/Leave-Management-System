import { Component, inject, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { EmployeeFormDialogComponent } from './employee-form-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSlideToggleModule, MatDialogModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  users = signal<User[]>([]);
  loading = signal(true);
  searchText = signal('');
  departmentFilter = signal<string | 'ALL'>('ALL');

  columns = ['name', 'email', 'department', 'role', 'status', 'actions'];

  departments = computed(() => [...new Set(this.users().map((u) => u.department))]);

  filteredUsers = computed(() => {
    let data = this.users();
    if (this.departmentFilter() !== 'ALL') {
      data = data.filter((u) => u.department === this.departmentFilter());
    }
    const term = this.searchText().trim().toLowerCase();
    if (term) {
      data = data.filter(
        (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }
    return data;
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe((users) => {
      this.users.set(users);
      this.loading.set(false);
    });
  }

  toggleActive(user: User): void {
    this.userService.updateUser(user.id, { active: !user.active }).subscribe(() => this.refresh());
  }

  openAddDialog(): void {
    const ref = this.dialog.open(EmployeeFormDialogComponent, { width: '420px', data: null });
    ref.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(EmployeeFormDialogComponent, { width: '420px', data: user });
    ref.afterClosed().subscribe((result) => {
      if (result) this.refresh();
    });
  }
}