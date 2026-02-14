import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { catchError, map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return auth.getAdminVerification().pipe(
    map(() => true), // token valid → allow
    catchError(() => {
      return router.navigate(['/login']); // invalid → redirect
    })
  );
};