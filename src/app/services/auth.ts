import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly adminEmail = 'vicky@gmail.com';
  private readonly adminPassword = '121212';
  private readonly sessionKey = 'eventBookingAdminSession';
  private readonly adminState =
    new BehaviorSubject<boolean>(this.hasAdminSession());

  adminState$ =
    this.adminState.asObservable();

  get isAdminLoggedIn(): boolean {

    return this.adminState.value;

  }

  login(email: string, password: string): boolean {

    const validLogin =
      this.normalizeEmail(email) === this.adminEmail &&
      password === this.adminPassword;

    if (!validLogin) {
      return false;
    }

    localStorage.setItem(
      this.sessionKey,
      'true'
    );

    this.adminState.next(true);

    return true;

  }

  logout(): void {

    localStorage.removeItem(this.sessionKey);
    this.adminState.next(false);

  }

  private hasAdminSession(): boolean {

    return localStorage.getItem(this.sessionKey) === 'true';

  }

  private normalizeEmail(email: string): string {

    return email.replace(/\s+/g, '').toLowerCase();

  }

}
