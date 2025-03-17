import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./checkout-page/checkout-page.component').then(
        (c) => c.CheckoutPageComponent
      ),
  },
];
