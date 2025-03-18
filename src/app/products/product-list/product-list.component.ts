import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId?: number;
  selectedCategory?: Category;
  loading = true;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.route.paramMap.subscribe((params) => {
      const categoryId = params.get('id');
      if (categoryId) {
        this.selectedCategoryId = +categoryId;
        this.loadProductsByCategory(this.selectedCategoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (this.selectedCategoryId) {
          this.selectedCategory = this.categories.find(
            (c) => c.id === this.selectedCategoryId
          );
        }
      },
      error: (error) => {
        console.error('Error loading categories', error);
      },
    });
  }

  loadAllProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.selectedCategoryId = undefined;
    this.selectedCategory = undefined;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error(
          `Error loading products for category ${categoryId}`,
          error
        );
        this.errorMessage =
          'Failed to load products for this category. Please try again later.';
        this.loading = false;
      },
    });
  }

  onCategorySelected(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.selectedCategory = this.categories.find((c) => c.id === categoryId);
    this.loadProductsByCategory(categoryId);
  }
}
