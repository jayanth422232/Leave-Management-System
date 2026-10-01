import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { API_URL } from '../constants';
import { Role, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly STORAGE_KEY = 'currentUser';

  login(email: string, password: string): Observable<User> {
    return this.http
      .get<User[]>(`${API_URL}/users`, { params: { email, password } })
      .pipe(
        map((users) => {
          const user = users[0];
          if (!user) throw new Error('Invalid email or password');
          if (!user.active) throw new Error('Your account is deactivated');
          const { password: _pw, ...safeUser } = user;
          return safeUser as User;
        }),
        tap((user) => localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user)))
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  getHomeRoute(role: Role): string {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'MANAGER': return '/manager/dashboard';
      default: return '/employee/dashboard';
    }
  }
}