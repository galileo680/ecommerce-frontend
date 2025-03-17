import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (authService.isLoggedIn() && !tokenService.isTokenExpired()) {
    return true;
  }

  router.navigate(['/auth/login'], {
    queryParams: { redirectUrl: router.url },
  });
  return false;
};
