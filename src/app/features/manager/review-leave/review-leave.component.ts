import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LeaveService } from '../../../core/services/leave.service';
import { UserService } from '../../../core/services/user.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { LeaveType } from '../../../core/models/leave-type.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-review-leave',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './review-leave.component.html',
  styleUrl: './review-leave.component.css',
})
export class ReviewLeaveComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private userService = inject(UserService);

  request = signal<LeaveRequest | null>(null);
  employee = signal<User | null>(null);
  leaveTypes = signal<LeaveType[]>([]);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal('');

  commentControl = this.fb.nonNullable.control('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    this.leaveService.getRequestById(id).subscribe((req) => {
      this.request.set(req);
      this.userService.getUserById(req.userId).subscribe((user) => {
        this.employee.set(user);
        this.loading.set(false);
      });
    });
  }

  typeName(id: number): string {
    return this.leaveTypes().find((t) => t.id === id)?.name ?? '—';
  }

  approve(): void {
    this.submit('APPROVED');
  }

  reject(): void {
    if (!this.commentControl.value.trim()) {
      this.errorMessage.set('A comment is required when rejecting a request.');
      this.commentControl.markAsTouched();
      return;
    }
    this.submit('REJECTED');
  }

  private submit(status: 'APPROVED' | 'REJECTED'): void {
    const req = this.request();
    if (!req) return;
    this.submitting.set(true);
    this.errorMessage.set('');
    this.leaveService.updateStatus(req.id, status, this.commentControl.value).subscribe({
      next: () => this.router.navigate(['/manager/pending-approvals']),
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }
}