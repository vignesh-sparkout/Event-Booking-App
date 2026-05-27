  import { CommonModule } from '@angular/common';
  import {Component, inject,OnDestroy} from '@angular/core';
  import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
  import {ActivatedRoute,Router,RouterLink} from '@angular/router';
  import { AuthService } from '../../services/auth';

  @Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule,RouterLink],
    templateUrl: './admin-login.html',
    styleUrl: './admin-login.css'
  })
  export class AdminLogin implements OnDestroy {

    private readonly fb = inject(FormBuilder)

    loginForm = this.fb.nonNullable.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]]
    });

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

    login(): void {

      if (this.showSuccessModal) {
        return;
      }

      if (this.loginForm.invalid) {
        this.errorMessage = '';
        this.loginForm.markAllAsTouched();
        return;
      }

      const value =this.loginForm.getRawValue();
      const loggedIn =
        this.authService.login(
          value.email.trim(),
          value.password
        );

      if (!loggedIn) {
        this.errorMessage =
          'Invalid admin email or password.';
        return;
      }

      this.errorMessage = '';
      this.showSuccessModal = true;
      this.loginForm.disable();
      this.redirectTimer = setTimeout(
        () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        1300
      );

    }

    ngOnDestroy(): void {

      if (this.redirectTimer) {
        clearTimeout(this.redirectTimer);
      }

    }
  }
