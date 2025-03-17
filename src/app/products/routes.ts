import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list.component').then(
        (c) => c.ProductListComponent
      ),
  },
  {
    path: 'category/:id',
    loadComponent: () =>
      import('./product-list/product-list.component').then(
        (c) => c.ProductListComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search-results/search-results.component').then(
        (c) => c.SearchResultsComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (c) => c.ProductDetailComponent
      ),
  },
];
