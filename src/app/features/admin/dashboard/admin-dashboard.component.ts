import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <h2>Admin Dashboard</h2>
    <p>Welcome, {{ auth.getCurrentUser()?.name }}</p>
  `,
})
export class AdminDashboardComponent {
  auth = inject(AuthService);
}