import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const adminGuard = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
