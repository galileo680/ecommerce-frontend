import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-edit-category',
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
    LoadingSpinnerComponent,
    MatIcon,
  ],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  category?: Category;
  categoryId!: number;
  loading = true;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    } else {
      this.errorMessage = 'Invalid category ID';
      this.loading = false;
    }
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

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;
        this.categoryForm.patchValue({
          name: category.name,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category', error);
        this.errorMessage = 'Failed to load category details';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.submitting = true;
    const category: Category = {
      ...this.categoryForm.value,
      id: this.categoryId,
    };

    this.categoryService.updateCategory(this.categoryId, category).subscribe({
      next: (category) => {
        this.snackBar.open('Category updated successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/category-management']);
      },
      error: (error) => {
        console.error('Error updating category', error);
        this.submitting = false;

        let errorMsg = 'Failed to update category';
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }

        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
    });
  }

  resetForm(): void {
    if (this.category) {
      this.categoryForm.patchValue({
        name: this.category.name,
      });
    }
  }
}
