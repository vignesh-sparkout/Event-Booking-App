import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const adminGuard: CanActivateFn = (
  _route,
  state
) => {

  const authService =
    inject(AuthService);
  
  if (authService.isAdminLoggedIn) {
    return true;
  }

  return inject(Router).createUrlTree(
    [
      '/admin-login'
    ],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );

};
