import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'product-management',
    loadComponent: () =>
      import('./product-management/product-management.component').then(
        (c) => c.ProductManagementComponent
      ),
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./add-product/add-product.component').then(
        (c) => c.AddProductComponent
      ),
  },
  {
    path: 'edit-product/:id',
    loadComponent: () =>
      import('./edit-product/edit-product.component').then(
        (c) => c.EditProductComponent
      ),
  },
  {
    path: 'category-management',
    loadComponent: () =>
      import('./category-management/category-management.component').then(
        (c) => c.CategoryManagementComponent
      ),
  },
  {
    path: 'add-category',
    loadComponent: () =>
      import('./add-category/add-category.component').then(
        (c) => c.AddCategoryComponent
      ),
  },
  {
    path: 'edit-category/:id',
    loadComponent: () =>
      import('./edit-category/edit-category.component').then(
        (c) => c.EditCategoryComponent
      ),
  },
];
