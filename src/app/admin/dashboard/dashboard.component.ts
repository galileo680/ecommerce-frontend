import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  productCount = 0;
  categoryCount = 0;
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.productCount = products.length;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.checkLoading();
      },
    });

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoryCount = categories.length;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.checkLoading();
      },
    });
  }

  checkLoading(): void {
    if (this.productCount !== undefined && this.categoryCount !== undefined) {
      this.loading = false;
    }
  }
}
