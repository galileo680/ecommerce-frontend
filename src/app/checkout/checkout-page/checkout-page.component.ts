import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models/cart.model';
import { Address } from '../../core/models/address.model';
import { PaymentDetails } from '../../core/models/payment.model';
import { OrderRequest } from '../../core/models/order-request.model';
import { ShippingFormComponent } from '../shipping-form/shipping-form.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSnackBarModule,
    ShippingFormComponent,
    PaymentFormComponent,
    OrderSummaryComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit {
  cart?: Cart;
  loading = true;
  submitting = false;
  errorMessage = '';

  shippingAddress?: Address;
  paymentDetails?: PaymentDetails;

  isShippingValid = false;
  isPaymentValid = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
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

        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
          this.router.navigate(['/cart']);
          this.snackBar.open('Your cart is empty', 'Close', { duration: 3000 });
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart', error);
        this.errorMessage = 'Failed to load your cart. Please try again.';
        this.loading = false;
      },
    });
  }

  onShippingAddressChange(address: Address): void {
    this.shippingAddress = address;
  }

  onShippingAddressValidChange(isValid: boolean): void {
    this.isShippingValid = isValid;
  }

  onPaymentDetailsChange(payment: PaymentDetails): void {
    this.paymentDetails = payment;
  }

  onPaymentDetailsValidChange(isValid: boolean): void {
    this.isPaymentValid = isValid;
  }

  canSubmitOrder(): boolean {
    return this.isShippingValid && this.isPaymentValid && !this.submitting;
  }

  onSubmitOrder(): void {
    if (
      !this.canSubmitOrder() ||
      !this.shippingAddress ||
      !this.paymentDetails
    ) {
      return;
    }

    this.submitting = true;

    const orderRequest: OrderRequest = {
      shippingAddress: this.shippingAddress,
      paymentDetails: this.paymentDetails,
      orderNotes: '',
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (order) => {
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/orders', order.id]);
      },
      error: (error) => {
        console.error('Error placing order', error);
        this.submitting = false;

        let errorMsg = 'Failed to place your order. Please try again.';
        if (error.status === 400 && error.error && error.error.message) {
          errorMsg = error.error.message;
        }

        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
    });
  }
}
