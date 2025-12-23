import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is 401 Unauthorized
      if (error.status === 401) {
        // Skip redirect for login endpoint to avoid redirect loops
        if (!req.url.includes('/auth/login')) {
          // Clear authentication data
          authService.logout();
          // Redirect to login page
          router.navigate(['/login']);
        }
      }
      // Re-throw the error so it can be handled by the calling code
      return throwError(() => error);
    })
  );
};

