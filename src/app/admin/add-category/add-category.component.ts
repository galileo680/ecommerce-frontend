import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIcon,
  ],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const category: Category = this.categoryForm.value;

    this.categoryService.createCategory(category).subscribe({
      next: (category) => {
        this.snackBar.open('Category created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/category-management']);
      },
      error: (error) => {
        console.error('Error creating category', error);
        this.loading = false;

        let errorMsg = 'Failed to create category';
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }

        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
    });
  }

  resetForm(): void {
    this.categoryForm.reset();
  }
}
