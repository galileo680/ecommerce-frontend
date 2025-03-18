import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity = 1;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid product ID';
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.errorMessage = 'Failed to load product details';
        this.loading = false;
      },
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.snackBar
        .open('Please log in to add items to cart', 'Login', {
          duration: 3000,
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: { redirectUrl: this.router.url },
          });
        });
      return;
    }

    this.cartService.addToCart(this.product.id!, this.quantity).subscribe({
      next: () => {
        this.snackBar
          .open(
            `${this.quantity} ${
              this.quantity > 1 ? 'items' : 'item'
            } added to cart`,
            'View Cart',
            {
              duration: 3000,
            }
          )
          .onAction()
          .subscribe(() => {
            this.router.navigate(['/cart']);
          });
      },
      error: (error) => {
        console.error('Error adding to cart', error);
        this.snackBar.open('Failed to add product to cart', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
