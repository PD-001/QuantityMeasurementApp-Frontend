import { Component, Input, OnInit } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../models/measurement.model';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @Input() activePage: 'dashboard' | 'operations' | 'profile' = 'dashboard';

  user: UserProfile | null = null;
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    if (this.isLoggedIn) {
      this.auth.loadUserProfile().subscribe(u => this.user = u);
    }
  }

  get avatarInitial(): string {
    return (this.user?.name || this.user?.email || 'U')[0].toUpperCase();
  }
}
