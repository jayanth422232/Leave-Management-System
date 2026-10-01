import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  template: `
    <h2>Manager Dashboard</h2>
    <p>Welcome, {{ auth.getCurrentUser()?.name }}</p>
  `,
})
export class ManagerDashboardComponent {
  auth = inject(AuthService);
}