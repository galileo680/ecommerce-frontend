import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() updateQuantity = new EventEmitter<{
    itemId: number;
    quantity: number;
  }>();
  @Output() removeItem = new EventEmitter<number>();

  adjustQuantity(change: number): void {
    const newQuantity = this.item.quantity + change;
    if (newQuantity >= 1) {
      this.updateQuantity.emit({
        itemId: this.item.id!,
        quantity: newQuantity,
      });
    }
  }

  onRemove(): void {
    this.removeItem.emit(this.item.id);
  }
}
