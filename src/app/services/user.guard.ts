import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const userGuard: CanActivateFn = (
  _route,
  state
) => {

  const authService =
    inject(AuthService);

  if (authService.isUserLoggedIn) {
    return true;
  }

  return inject(Router).createUrlTree(
    [
      '/signin'
    ],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );

};
