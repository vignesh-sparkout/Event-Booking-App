import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './user-signin.html',
  styleUrl: './user-signin.css'
})
export class UserSignin {

  private readonly fb =
    inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  errorMessage = '';
  returnUrl = '/events';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ||
      '/events';

    if (this.authService.isUserLoggedIn) {
      this.router.navigateByUrl(this.returnUrl);
    }

  }

  signIn(): void {

    if (this.loginForm.invalid) {
      this.errorMessage = '';
      this.loginForm.markAllAsTouched();
      return;
    }

    const value =
      this.loginForm.getRawValue();

    const loggedIn =
      this.authService.userLogin(
        value.email.trim(),
        value.password
      );

    if (!loggedIn) {
      this.errorMessage =
        'Invalid email or password.';
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl(this.returnUrl);

  }

}
