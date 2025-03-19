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

import { Address } from '../../core/models/address.model';

@Component({
  selector: 'app-shipping-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss'],
})
export class ShippingFormComponent implements OnInit {
  @Output() shippingAddressValid = new EventEmitter<boolean>();
  @Output() shippingAddressChange = new EventEmitter<Address>();

  shippingForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.shippingForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });

    this.shippingForm.statusChanges.subscribe((status) => {
      this.shippingAddressValid.emit(status === 'VALID');
    });

    this.shippingForm.valueChanges.subscribe((value) => {
      if (this.shippingForm.valid) {
        this.shippingAddressChange.emit(value);
      }
    });
  }
}
