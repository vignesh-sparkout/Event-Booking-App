import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';

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

  get isOrganizerPage(): boolean {

    return this.router.url.startsWith('/organizer');

  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.adminState$ =
      this.authService.adminState$;

  }

  logout(): void {

    this.authService.logout();
    this.router.navigate([
      '/'
    ]);

  }

}
