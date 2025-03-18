import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardActions,
    MatCardContent,
    RouterLink,
    MatButton,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  addToCart(): void {
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

    this.cartService.addToCart(this.product.id!, 1).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart', 'Close', {
          duration: 3000,
        });
        this.addedToCart.emit();
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
