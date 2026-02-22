import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const role = route.data?.['role'];

  if (!auth.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  if (role && auth.getUser()?.role !== role) {
    router.navigate(['/']);
    return false;
  }

  return true;
};