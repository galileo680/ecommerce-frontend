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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  imageFile?: File;
  imagePreview?: string;
  loading = false;
  categoriesLoading = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      price: ['', [Validators.required, Validators.min(1.0)]],
      quantity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
      categoryId: ['', [Validators.required]],
    });
  }

  loadCategories(): void {
    this.categoriesLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
        });
        this.categoriesLoading = false;
      },
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.imageFile) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.keys(this.productForm.value).forEach((key) => {
      formData.append(key, this.productForm.value[key]);
    });

    formData.append('imageFile', this.imageFile);

    this.productService.createProduct(formData).subscribe({
      next: (product) => {
        this.snackBar.open('Product created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/product-management']);
      },
      error: (error) => {
        console.error('Error creating product', error);
        this.loading = false;

        let errorMsg = 'Failed to create product';
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }

        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
    });
  }

  resetForm(): void {
    this.productForm.reset();
    this.imageFile = undefined;
    this.imagePreview = undefined;
  }
}
