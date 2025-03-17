import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: 'activate-account',
    loadComponent: () =>
      import('./activate-account/activate-account.component').then(
        (c) => c.ActivateAccountComponent
      ),
  },
];
