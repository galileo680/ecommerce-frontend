import { Address } from './address.model';
import { PaymentDetails } from './payment.model';

export interface OrderRequest {
  shippingAddress: Address;
  paymentDetails: PaymentDetails;
  orderNotes?: string;
  couponCode?: string;
}
