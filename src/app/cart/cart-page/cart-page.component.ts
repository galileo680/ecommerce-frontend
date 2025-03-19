import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';
import { CartItem } from '../../core/models/cart-item.model';
import { CartItemComponent } from '../../shared/components/cart-item/cart-item.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    CartItemComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cart?: Cart;
  loading = true;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart', error);
        this.errorMessage = 'Failed to load your cart. Please try again.';
        this.loading = false;
      },
    });
  }

  updateCartItem(event: { itemId: number; quantity: number }): void {
    this.cartService.updateCartItem(event.itemId, event.quantity).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.snackBar.open('Cart updated', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating cart item', error);
        this.snackBar.open('Failed to update cart', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  removeCartItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.loadCart();
        this.snackBar.open('Item removed from cart', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error removing cart item', error);
        this.snackBar.open('Failed to remove item from cart', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  clearCart(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear Cart',
        message: 'Are you sure you want to remove all items from your cart?',
        confirmText: 'Clear Cart',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.loadCart();
            this.snackBar.open('Cart cleared', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error clearing cart', error);
            this.snackBar.open('Failed to clear cart', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
