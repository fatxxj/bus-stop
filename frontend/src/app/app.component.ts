import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { JourneyListComponent } from './components/journey/journey-list/journey-list.component';
import { StopListComponent } from './components/stop/stop-list/stop-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    JourneyListComponent,
    StopListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TUG\'s Bus Company';
  activeTab: string = 'journeys';
  currentUser: User | null = null;
  showUserMenu: boolean = false;
  showProfileModal: boolean = false;
  showLoginModal: boolean = false;
  showRegisterModal: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.closeLogin();
        this.closeRegister();
      }
    });

    // Add event listener for showRegisterModal event
    window.addEventListener('showRegisterModal', () => {
      this.openRegister();
    });
  }

  ngOnDestroy() {
    // Remove event listener when component is destroyed
    window.removeEventListener('showRegisterModal', () => {
      this.openRegister();
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  openProfile() {
    this.showProfileModal = true;
    this.showUserMenu = false;
  }

  closeProfile() {
    this.showProfileModal = false;
  }

  openLogin() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }

  closeLogin() {
    this.showLoginModal = false;
  }

  openRegister() {
    this.showRegisterModal = true;
    this.showLoginModal = false;
  }

  closeRegister() {
    this.showRegisterModal = false;
  }
}