import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-box">
        <h2>Edit Profile</h2>
        <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="firstName"
              required
              #firstNameInput="ngModel"
              [class.is-invalid]="firstNameInput.invalid && firstNameInput.touched"
            >
            <div class="error-message" *ngIf="firstNameInput.invalid && firstNameInput.touched">
              First name is required
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="lastName"
              required
              #lastNameInput="ngModel"
              [class.is-invalid]="lastNameInput.invalid && lastNameInput.touched"
            >
            <div class="error-message" *ngIf="lastNameInput.invalid && lastNameInput.touched">
              Last name is required
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [value]="user?.email" disabled>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" [disabled]="profileForm.invalid || isLoading">
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .profile-box {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
      position: relative;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #2c3e50;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
      font-weight: 500;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: #f8fafc;
    }

    input:focus {
      outline: none;
      border-color: #4299e1;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
    }

    input:disabled {
      background-color: #f8fafc;
      border-color: #e2e8f0;
      color: #4a5568;
      cursor: not-allowed;
    }

    input.is-invalid {
      border-color: #e53e3e;
      background-color: #fff5f5;
    }

    input.is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
    }

    .error-message {
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .success-message {
      color: #38a169;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.875rem;
      background-color: #4299e1;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 1rem;
    }

    button:hover {
      background-color: #3182ce;
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    button:disabled {
      background-color: #cbd5e0;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  firstName: string = '';
  lastName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
      }
    });
  }

  onSubmit() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile({
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error || 'An error occurred while updating profile';
        this.isLoading = false;
      }
    });
  }
} 