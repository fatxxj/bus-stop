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
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .profile-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    input.is-invalid {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .success-message {
      color: #28a745;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
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