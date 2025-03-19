import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, MatDividerModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  @Input() cart?: Cart;

  constructor() {}

  ngOnInit(): void {}
}
