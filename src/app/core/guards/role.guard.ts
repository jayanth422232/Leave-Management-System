import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = route.data['roles'] as Role[];
  const user = auth.getCurrentUser();
  if (user && allowed.includes(user.role)) return true;
  return user ? router.parseUrl(auth.getHomeRoute(user.role)) : router.parseUrl('/login');
};