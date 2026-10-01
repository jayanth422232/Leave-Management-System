import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../constants';
import { LeaveRequest } from '../models/leave-request.model';
import { LeaveType } from '../models/leave-type.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private http = inject(HttpClient);

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${API_URL}/leaveTypes`);
  }

  getRequestsByUser(userId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${API_URL}/leaveRequests`, {
      params: { userId },
    });
  }

  getRequestById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${API_URL}/leaveRequests/${id}`);
  }

  applyLeave(request: Omit<LeaveRequest, 'id'>): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${API_URL}/leaveRequests`, request);
  }

  cancelLeave(id: number): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${API_URL}/leaveRequests/${id}`, {
      status: 'CANCELLED',
    });
  }

  getRequestsByManager(managerUserIds: number[]): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${API_URL}/leaveRequests`).pipe(
      map((all) => all.filter((r) => managerUserIds.includes(r.userId)))
    );
  }

  updateStatus(id: number, status: 'APPROVED' | 'REJECTED', comment: string): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${API_URL}/leaveRequests/${id}`, {
      status,
      managerComment: comment,
    });
  }

  // remaining balance = leave type's maxDays − days used in APPROVED or PENDING requests
  calculateBalance(leaveType: LeaveType, userRequests: LeaveRequest[]): number {
    const used = userRequests
      .filter((r) => r.leaveTypeId === leaveType.id && (r.status === 'APPROVED' || r.status === 'PENDING'))
      .reduce((sum, r) => sum + r.days, 0);
    return leaveType.maxDays - used;
  }
}