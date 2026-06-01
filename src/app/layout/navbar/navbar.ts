import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { LoggedInUser } from '../../Models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  adminState$: Observable<boolean>;
  userState$: Observable<LoggedInUser | null>;
  menuOpen = false;

  get isOrganizerPage(): boolean {

    return this.router.url.startsWith('/organizer');

  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.adminState$ =
      this.authService.adminState$;
    this.userState$ =
      this.authService.userState$;

  }

  logout(): void {

    this.authService.logout();
    this.closeMenu();
    this.router.navigate([
      '/'
    ]);

  }

  logoutUser(): void {

    this.authService.userLogout();
    this.closeMenu();
    this.router.navigate([
      '/events'
    ]);

  }

  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

  }

  closeMenu(): void {

    this.menuOpen = false;

  }

}
