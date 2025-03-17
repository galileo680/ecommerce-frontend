import { CartItem } from './cart-item.model';

export interface Cart {
  id?: number;
  totalAmount: number;
  cartItems: CartItem[];
}
