import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  email = '';
  password = '';
  errorMessage = '';
  private returnUrl = '/organizer/dashboard';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      '/organizer/dashboard';

    if (this.authService.isAdminLoggedIn) {
      this.router.navigateByUrl(this.returnUrl);
    }

  }

  login(form: NgForm): void {

    if (form.invalid) {
      this.errorMessage = '';
      form.control.markAllAsTouched();
      return;
    }

    const loggedIn =
      this.authService.login(
        this.email.trim(),
        this.password
      );

    if (!loggedIn) {
      this.errorMessage =
        'Invalid admin email or password.';
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl(this.returnUrl);

  }
}
