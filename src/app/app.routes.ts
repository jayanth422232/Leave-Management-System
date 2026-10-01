import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PlaceholderComponent } from './shared/components/placeholder/placeholder.component';
import { EmployeeDashboardComponent } from './features/employee/dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from './features/manager/dashboard/manager-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'employee',
        canActivate: [roleGuard],
        data: { roles: ['EMPLOYEE'] },
        children: [
          { path: 'dashboard', component: EmployeeDashboardComponent },
          { path: 'apply-leave', component: PlaceholderComponent, data: { title: 'Apply Leave' } },
          { path: 'my-leaves', component: PlaceholderComponent, data: { title: 'My Leaves' } },
          { path: 'leave-balance', component: PlaceholderComponent, data: { title: 'Leave Balance' } },
          { path: 'profile', component: PlaceholderComponent, data: { title: 'Profile' } },
        ],
      },
      {
        path: 'manager',
        canActivate: [roleGuard],
        data: { roles: ['MANAGER'] },
        children: [
          { path: 'dashboard', component: ManagerDashboardComponent },
          { path: 'team-leaves', component: PlaceholderComponent, data: { title: 'Team Leaves' } },
          { path: 'pending-approvals', component: PlaceholderComponent, data: { title: 'Pending Approvals' } },
          { path: 'team-calendar', component: PlaceholderComponent, data: { title: 'Team Calendar' } },
        ],
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'employees', component: PlaceholderComponent, data: { title: 'Employees' } },
          { path: 'leave-types', component: PlaceholderComponent, data: { title: 'Leave Types' } },
          { path: 'reports', component: PlaceholderComponent, data: { title: 'Reports' } },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];