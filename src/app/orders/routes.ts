import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./order-list/order-list.component').then(
        (c) => c.OrderListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./order-detail/order-detail.component').then(
        (c) => c.OrderDetailComponent
      ),
  },
];
