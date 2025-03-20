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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-edit-product',
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
    LoadingSpinnerComponent,
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  product?: Product;
  productId!: number;
  imageFile?: File;
  imagePreview?: string;
  loading = true;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.loadProduct(this.productId);
    } else {
      this.errorMessage = 'Invalid product ID';
      this.loading = false;
    }
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
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.setFormValues(product);
        this.imagePreview = product.imageUrl;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.errorMessage = 'Failed to load product details';
        this.loading = false;
      },
    });
  }

  setFormValues(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      this.imageFile = files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = new FormData();

    // Add form values to FormData
    Object.keys(this.productForm.value).forEach((key) => {
      formData.append(key, this.productForm.value[key]);
    });

    // Add image file if a new one was selected
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (product) => {
        this.snackBar.open('Product updated successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/product-management']);
      },
      error: (error) => {
        console.error('Error updating product', error);
        this.submitting = false;

        let errorMsg = 'Failed to update product';
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }

        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
    });
  }

  resetForm(): void {
    if (this.product) {
      this.setFormValues(this.product);
    }
  }
}
