import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadChildren: () => import('./cart/routes').then((m) => m.CART_ROUTES),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./checkout/routes').then((m) => m.CHECKOUT_ROUTES),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('./orders/routes').then((m) => m.ORDERS_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./admin/routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
