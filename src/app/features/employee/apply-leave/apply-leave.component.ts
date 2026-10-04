import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveService } from '../../../core/services/leave.service';
import { LeaveType } from '../../../core/models/leave-type.model';

// custom validator: toDate cannot be before fromDate
function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const from = group.get('fromDate')?.value;
  const to = group.get('toDate')?.value;
  if (!from || !to) return null;
  return new Date(to) < new Date(from) ? { dateRange: true } : null;
}

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatCardModule,
  ],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css',
})
export class ApplyLeaveComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private leaveService = inject(LeaveService);
  private router = inject(Router);

  user = this.auth.getCurrentUser()!;
  leaveTypes = signal<LeaveType[]>([]);
  submitting = signal(false);
  errorMessage = signal('');
  minDate = new Date(); // blocks past dates in the date picker UI itself

  form = this.fb.nonNullable.group(
    {
      leaveTypeId: [null as number | null, Validators.required],
      fromDate: [null as Date | null, Validators.required],
      toDate: [null as Date | null, Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
    },
    { validators: dateRangeValidator }
  );

  // computed, read-only "Number of Days" field shown next to the dates
  numberOfDays = computed(() => {
    const from = this.form.controls.fromDate.value;
    const to = this.form.controls.toDate.value;
    if (!from || !to || to < from) return 0;
    const diffMs = to.getTime() - from.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive of both ends
  });

  constructor() {
    this.leaveService.getLeaveTypes().subscribe((types) => this.leaveTypes.set(types));
    // recompute numberOfDays whenever dates change
    this.form.controls.fromDate.valueChanges.subscribe(() => this.numberOfDays());
    this.form.controls.toDate.valueChanges.subscribe(() => this.numberOfDays());
  }

  selectedLeaveType(): LeaveType | undefined {
    return this.leaveTypes().find((t) => t.id === this.form.controls.leaveTypeId.value);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const maxDays = this.selectedLeaveType()?.maxDays ?? Infinity;
    if (this.numberOfDays() > maxDays) {
      this.errorMessage.set(`This leave type allows a maximum of ${maxDays} days.`);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const { leaveTypeId, fromDate, toDate, reason } = this.form.getRawValue();

    this.leaveService
      .applyLeave({
        userId: this.user.id,
        leaveTypeId: leaveTypeId!,
        fromDate: this.toIsoDate(fromDate!),
        toDate: this.toIsoDate(toDate!),
        days: this.numberOfDays(),
        reason,
        status: 'PENDING',
        managerComment: '',
        appliedOn: this.toIsoDate(new Date()),
      })
      .subscribe({
        next: () => this.router.navigate(['/employee/my-leaves']),
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Something went wrong. Please try again.');
        },
      });
  }

  private toIsoDate(d: Date): string {
    // local date, not UTC — avoids the "date shifts by one day" bug
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}