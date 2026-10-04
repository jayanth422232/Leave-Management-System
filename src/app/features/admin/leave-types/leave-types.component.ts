import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveType } from '../../../core/models/leave-type.model';

@Component({
  selector: 'app-leave-types',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
  ],
  templateUrl: './leave-types.component.html',
  styleUrl: './leave-types.component.css',
})
export class LeaveTypesComponent {
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);

  types = signal<LeaveType[]>([]);
  loading = signal(true);
  columns = ['name', 'maxDays', 'active', 'actions'];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    maxDays: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.leaveService.getLeaveTypes().subscribe((types) => {
      this.types.set(types);
      this.loading.set(false);
    });
  }

  addType(): void {
    if (this.form.invalid) return;
    const { name, maxDays } = this.form.getRawValue();
    this.leaveService.createLeaveType({ name, maxDays, active: true }).subscribe(() => {
      this.form.reset({ name: '', maxDays: 1 });
      this.refresh();
    });
  }

  toggleActive(type: LeaveType): void {
    this.leaveService.updateLeaveType(type.id, { active: !type.active }).subscribe(() => this.refresh());
  }

  deleteType(type: LeaveType): void {
    if (!confirm(`Delete "${type.name}"? This cannot be undone.`)) return;
    this.leaveService.deleteLeaveType(type.id).subscribe(() => this.refresh());
  }
}