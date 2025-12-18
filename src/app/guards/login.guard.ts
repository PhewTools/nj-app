import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Redirect to dashboard if already authenticated
    router.navigate(['/tabs/dashboard']);
    return false;
  }

  // Allow access to login page if not authenticated
  return true;
};

