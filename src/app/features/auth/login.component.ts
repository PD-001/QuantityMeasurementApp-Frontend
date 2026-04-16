import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  activeTab: 'login' | 'signup' = 'login';

  // Login fields
  loginEmail = '';
  loginPassword = '';
  loginAlert = '';
  loginAlertType: 'error' | 'success' | 'info' = 'error';
  loginLoading = false;
  showLoginPw = false;

  // Signup fields
  signupName = '';
  signupEmail = '';
  signupPassword = '';
  signupAlert = '';
  signupAlertType: 'error' | 'success' | 'info' = 'error';
  signupLoading = false;
  showSignupPw = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Handle OAuth token in URL (redirect from Google OAuth)
    if (this.auth.checkUrlForToken()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    // Handle OAuth error
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      this.loginAlert = 'Google login failed. Please try again.';
      this.loginAlertType = 'error';
    }
  }

  switchTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.loginAlert = '';
    this.signupAlert = '';
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }

  async handleLogin(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) {
      this.loginAlert = 'Please fill in all fields.';
      this.loginAlertType = 'error';
      return;
    }
    this.loginLoading = true;
    this.loginAlert = '';

    this.auth.loginWithEmail(this.loginEmail, this.loginPassword).subscribe(res => {
      this.loginLoading = false;
      if (res.ok && res.data?.token) {
        this.auth.setToken(res.data.token);
        this.router.navigate(['/dashboard']);
      } else {
        this.loginAlert = res.data?.error || 'Login failed. Please try again.';
        this.loginAlertType = 'error';
      }
    });
  }

  handleSignup(): void {
    if (!this.signupName || !this.signupEmail || !this.signupPassword) {
      this.signupAlert = 'Please fill in all fields.';
      this.signupAlertType = 'error';
      return;
    }
    this.signupLoading = true;
    this.signupAlert = '';

    this.auth.registerWithEmail(this.signupEmail, this.signupPassword, this.signupName).subscribe(res => {
      this.signupLoading = false;
      if (res.ok && res.data?.token) {
        this.auth.setToken(res.data.token);
        this.router.navigate(['/dashboard']);
      } else {
        this.signupAlert = res.data?.error || 'Registration failed. Please try again.';
        this.signupAlertType = 'error';
      }
    });
  }
}
