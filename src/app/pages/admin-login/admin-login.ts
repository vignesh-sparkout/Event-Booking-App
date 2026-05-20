import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy
} from '@angular/core';
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
export class AdminLogin implements OnDestroy {

  email = '';
  password = '';
  errorMessage = '';
  showSuccessModal = false;
  private returnUrl = '/organizer/dashboard';
  private redirectTimer?: ReturnType<typeof setTimeout>;

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

    if (this.showSuccessModal) {
      return;
    }

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
    this.showSuccessModal = true;
    this.redirectTimer = setTimeout(
      () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      1500
    );

  }

  ngOnDestroy(): void {

    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }

  }
}
