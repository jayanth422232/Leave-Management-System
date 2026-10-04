import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { EmployeeDashboardComponent } from './features/employee/dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from './features/manager/dashboard/manager-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ApplyLeaveComponent } from './features/employee/apply-leave/apply-leave.component';
import { MyLeavesComponent } from './features/employee/my-leaves/my-leaves.component';
import { LeaveDetailsComponent } from './features/employee/leave-details/leave-details.component';
import { LeaveBalanceComponent } from './features/employee/leave-balance/leave-balance.component';
import { ProfileComponent } from './features/employee/profile/profile.component';
import { PendingApprovalsComponent } from './features/manager/pending-approvals/pending-approvals.component';
import { ReviewLeaveComponent } from './features/manager/review-leave/review-leave.component';
import { TeamLeavesComponent } from './features/manager/team-leaves/team-leaves.component';
import { TeamCalendarComponent } from './features/manager/team-calendar/team-calendar.component';
import { EmployeesComponent } from './features/admin/employees/employees.component';
import { LeaveTypesComponent } from './features/admin/leave-types/leave-types.component';
import { ReportsComponent } from './features/admin/reports/reports.component';

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
          { path: 'apply-leave', component: ApplyLeaveComponent },
          { path: 'my-leaves', component: MyLeavesComponent },
          { path: 'my-leaves/:id', component: LeaveDetailsComponent },
          { path: 'leave-balance', component: LeaveBalanceComponent },
          { path: 'profile', component: ProfileComponent },
        ],
      },
      {
        path: 'manager',
        canActivate: [roleGuard],
        data: { roles: ['MANAGER'] },
        children: [
          { path: 'dashboard', component: ManagerDashboardComponent },
          { path: 'team-leaves', component: TeamLeavesComponent },
          { path: 'pending-approvals', component: PendingApprovalsComponent },
          { path: 'review-leave/:id', component: ReviewLeaveComponent },
          { path: 'team-calendar', component: TeamCalendarComponent },
        ],
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'employees', component: EmployeesComponent },
          { path: 'leave-types', component: LeaveTypesComponent },
          { path: 'reports', component: ReportsComponent },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];