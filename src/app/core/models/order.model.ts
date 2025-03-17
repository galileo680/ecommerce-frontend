import { Address } from './address.model';
import { OrderItem } from './order-item.model';

export interface Order {
  id?: number;
  orderDate?: string;
  status?: string;
  totalAmount: number;
  shippingAddress: Address;
  orderItems: OrderItem[];
}
