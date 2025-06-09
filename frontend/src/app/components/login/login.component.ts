import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error || 'An error occurred during login';
          this.isLoading = false;
        }
      });
  }

  goToRegister() {
    // Dispatch a custom event to notify the parent component to show the register modal
    const event = new CustomEvent('showRegisterModal');
    window.dispatchEvent(event);
  }

  forgotPassword() {
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality coming soon!');
  }
} 