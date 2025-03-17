import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';
import { CartItemUpdateRequest } from '../models/cart-item-update.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    if (localStorage.getItem('token')) {
      this.getCart().subscribe(
        (cart) => this.cartSubject.next(cart),
        (error) => console.error('Error loading cart', error)
      );
    }
  }

  getCart(): Observable<Cart> {
    return this.http
      .get<Cart>(this.apiUrl)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  addToCart(productId: number, quantity: number): Observable<Cart> {
    const cartItem: CartItem = { productId, quantity };
    return this.http
      .post<Cart>(`${this.apiUrl}/items`, cartItem)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  updateCartItem(itemId: number, quantity: number): Observable<Cart> {
    const request: CartItemUpdateRequest = { quantity };
    return this.http
      .put<Cart>(`${this.apiUrl}/items/${itemId}`, request)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  removeFromCart(itemId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/items/${itemId}`)
      .pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/clear`)
      .pipe(
        tap(() => this.cartSubject.next({ totalAmount: 0, cartItems: [] }))
      );
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    if (!cart || !cart.cartItems) {
      return 0;
    }
    return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
