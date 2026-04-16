import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../shared/models/measurement.model';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, NavbarComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  loading = true;
  alert = '';
  alertType: 'error' | 'success' | 'info' = 'error';
  tokenVisible = false;
  token: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.clearProfileCache();
    this.auth.loadUserProfile().subscribe(user => {
      this.loading = false;
      if (user) {
        this.user = user;
      } else {
        this.alert = 'Failed to load profile. Please try again.';
        this.alertType = 'error';
      }
    });
  }

  get avatarInitial(): string {
    return (this.user?.name || this.user?.email || 'U')[0].toUpperCase();
  }

  get providerLabel(): string {
    return (this.user?.provider === 'local') ? 'Email / Password' : 'Google OAuth2';
  }

  toggleToken(): void {
    this.tokenVisible = !this.tokenVisible;
    if (this.tokenVisible) {
      this.token = this.auth.getToken() || '(no token found)';
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
