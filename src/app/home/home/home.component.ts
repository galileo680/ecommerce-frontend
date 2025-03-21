import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ProductCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  errorMessage = '';

  categoryIcons: string[] = [
    'category',
    'shopping_bag',
    'inventory_2',
    'checkroom',
    'devices',
    'sports_esports',
    'home',
    'kitchen',
    'sports_soccer',
    'apparel',
    'steps',
    'pedal_bike',
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      },
    });
  }

  //ToDo: change icon selection mechanism
  getCategoryIcon(index: number): string {
    return this.categoryIcons[index % this.categoryIcons.length];
  }
}
