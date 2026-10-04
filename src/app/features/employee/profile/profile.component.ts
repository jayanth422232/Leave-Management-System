import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <h2>Profile</h2>
    <mat-card class="profile-card">
      <div class="row"><span class="label">Name</span><span>{{ user.name }}</span></div>
      <div class="row"><span class="label">Email</span><span>{{ user.email }}</span></div>
      <div class="row"><span class="label">Department</span><span>{{ user.department }}</span></div>
      <div class="row"><span class="label">Role</span><span>{{ user.role }}</span></div>
    </mat-card>
  `,
  styles: [`
    .profile-card { max-width: 400px; padding: 24px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .label { color: #666; font-weight: 500; }
  `],
})
export class ProfileComponent {
  private auth = inject(AuthService);
  user = this.auth.getCurrentUser()!;
}