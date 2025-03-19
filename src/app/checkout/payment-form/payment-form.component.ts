import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PaymentDetails } from '../../core/models/payment.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit {
  @Output() paymentDetailsValid = new EventEmitter<boolean>();
  @Output() paymentDetailsChange = new EventEmitter<PaymentDetails>();

  paymentForm!: FormGroup;
  hideCardNumber = true;
  hideCvv = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: ['credit_card', [Validators.required]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{13,19}$/)],
      ],
      cardHolderName: ['', [Validators.required]],
      cardExpirationDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });

    this.paymentForm.statusChanges.subscribe((status) => {
      this.paymentDetailsValid.emit(status === 'VALID');
    });

    this.paymentForm.valueChanges.subscribe((value) => {
      if (this.paymentForm.valid) {
        this.paymentDetailsChange.emit(value);
      }
    });
  }
}
