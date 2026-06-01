import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {AbstractControl,FormBuilder,ReactiveFormsModule,
  ValidationErrors,Validators} from '@angular/forms';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth';

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {

  const password =
    control.get('password')?.value;
  const confirmPassword =
    control.get('confirmPassword')?.value;

  return password &&
    confirmPassword &&
    password !== confirmPassword
    ? {
        passwordMismatch: true
      }
    : null;

}

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './user-register.html',
  styleUrl: './user-register.css'
})
export class UserRegister {

  private readonly fb =
    inject(FormBuilder);

  registerForm = this.fb.nonNullable.group(
    {
      name: [ '',     
          [
          Validators.required,
          Validators.minLength(2)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      countryCode: [
        '+91',
        [
          Validators.required
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{6,14}$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    },
    {
      validators: passwordMatchValidator
    }
  );

  errorMessage = '';
  returnUrl = '/events';

  readonly countryCodes = [
    {
      label: 'India',
      code: '+91'
    },
    {
      label: 'United States',
      code: '+1'
    },
    {
      label: 'United Kingdom',
      code: '+44'
    },
    {
      label: 'Australia',
      code: '+61'
    },
    {
      label: 'Canada',
      code: '+1'
    },
    {
      label: 'Singapore',
      code: '+65'
    },
    {
      label: 'United Arab Emirates',
      code: '+971'
    }
  ];

  get passwordMismatch(): boolean {

    return Boolean(
      this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.controls.confirmPassword.touched
    );

  }

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

  register(): void {

    if (this.registerForm.invalid) {
      this.errorMessage = '';
      this.registerForm.markAllAsTouched();
      return;
    }

    const value =
      this.registerForm.getRawValue();

    const result =
      this.authService.registerUser({
        name: value.name.trim(),
        email: value.email.trim(),
        countryCode: value.countryCode,
        phone: value.phone.trim(),
        password: value.password
      });

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl(this.returnUrl);

  }

}
