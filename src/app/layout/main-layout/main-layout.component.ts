import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const MENUS: Record<Role, MenuItem[]> = {
  EMPLOYEE: [
    { label: 'Dashboard', icon: 'dashboard', route: '/employee/dashboard' },
    { label: 'Apply Leave', icon: 'edit_calendar', route: '/employee/apply-leave' },
    { label: 'My Leaves', icon: 'list_alt', route: '/employee/my-leaves' },
    { label: 'Leave Balance', icon: 'account_balance_wallet', route: '/employee/leave-balance' },
    { label: 'Profile', icon: 'person', route: '/employee/profile' },
  ],
  MANAGER: [
    { label: 'Dashboard', icon: 'dashboard', route: '/manager/dashboard' },
    { label: 'Team Leaves', icon: 'groups', route: '/manager/team-leaves' },
    { label: 'Pending Approvals', icon: 'pending_actions', route: '/manager/pending-approvals' },
    { label: 'Team Calendar', icon: 'calendar_month', route: '/manager/team-calendar' },
  ],
  ADMIN: [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Employees', icon: 'badge', route: '/admin/employees' },
    { label: 'Leave Types', icon: 'category', route: '/admin/leave-types' },
    { label: 'Reports', icon: 'bar_chart', route: '/admin/reports' },
  ],
};

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  private auth = inject(AuthService);

  user = this.auth.getCurrentUser()!;
  menu = MENUS[this.user.role];

  logout(): void {
    this.auth.logout();
  }
}