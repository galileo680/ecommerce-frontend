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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  redirectUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.queryParams.subscribe((params) => {
      this.redirectUrl = params['redirectUrl'] || '/';
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirectUrl]);
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginRequest: LoginRequest = this.loginForm.value;

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.userService.getCurrentUser().subscribe({
          next: (user) => {
            this.authService.setCurrentUser(user);
            this.loading = false;
            this.router.navigateByUrl(this.redirectUrl);
          },
          error: (error) => {
            console.error('Error loading user data:', error);
            this.loading = false;
            this.snackBar.open(
              'Logged in, but failed to load user data',
              'Close',
              {
                duration: 3000,
              }
            );
            this.router.navigateByUrl(this.redirectUrl);
          },
        });
      },
      error: (error) => {
        console.error('Login error', error);
        this.loading = false;
        let errorMessage = 'Failed to log in. Please try again.';

        if (error.status === 400) {
          errorMessage = 'Invalid email or password.';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
