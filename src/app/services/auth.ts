import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {LoggedInUser, RegisteredUser, UserRegistration} from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly adminEmail = 'vicky@gmail.com';
  private readonly adminPassword = '121212';
  private readonly sessionKey = 'eventBookingAdminSession';
  private readonly usersKey = 'eventBookingRegisteredUsers';
  private readonly userSessionKey = 'eventBookingUserSession';
  private readonly adminState =
    new BehaviorSubject<boolean>(this.hasAdminSession());
  private readonly userState =
    new BehaviorSubject<LoggedInUser | null>(this.getUserSession());

  adminState$ =
    this.adminState.asObservable();

  userState$ =
    this.userState.asObservable();

  get isAdminLoggedIn(): boolean {

    return this.adminState.value;

  }

  get isUserLoggedIn(): boolean {

    return Boolean(this.userState.value);

  }

  get currentUser(): LoggedInUser | null {

    return this.userState.value;

  }

  login(email: string, password: string): boolean {

    const validLogin =
      this.normalizeEmail(email) === this.adminEmail &&
      password === this.adminPassword;

    if (!validLogin) {
      return false;
    }

    sessionStorage.setItem(
      this.sessionKey,
      'true'
    );

    this.adminState.next(true);

    return true;

  }

  registerUser(
    userRegistration: UserRegistration
  ): {
    success: boolean;
    message: string;
    user?: LoggedInUser;
  } {

    const email =
      this.normalizeEmail(userRegistration.email);
    const registeredUsers =
      this.getRegisteredUsers();

    const userAlreadyExists =
      registeredUsers.some(user => user.email === email);

    if (userAlreadyExists) {
      return {
        success: false,
        message: 'This email is already registered.'
      };
    }

    const registeredUser: RegisteredUser = {
      id: `USR${Date.now().toString().slice(-8)}`,
      name: userRegistration.name.trim(),
      email,
      countryCode: userRegistration.countryCode,
      phone: userRegistration.phone.trim(),
      password: userRegistration.password,
      registeredAt: new Date().toISOString()
    };

    this.saveRegisteredUsers([
      ...registeredUsers,
      registeredUser
    ]);

    const loggedInUser =
      this.toLoggedInUser(registeredUser);

    this.setUserSession(loggedInUser);

    return {
      success: true,
      message: 'Registration successful.',
      user: loggedInUser
    };

  }

  userLogin(
    email: string,
    password: string
  ): boolean {

    const normalizedEmail =
      this.normalizeEmail(email);

    const user =
      this.getRegisteredUsers().find(
        registeredUser =>
          registeredUser.email === normalizedEmail &&
          registeredUser.password === password
      );

    if (!user) {
      return false;
    }

    this.setUserSession(
      this.toLoggedInUser(user)
    );

    return true;

  }

  userLogout(): void {

    sessionStorage.removeItem(this.userSessionKey);
    localStorage.removeItem(this.userSessionKey);
    this.userState.next(null);

  }

  logout(): void {

    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.sessionKey);
    this.adminState.next(false);

  }

  private hasAdminSession(): boolean {

    localStorage.removeItem(this.sessionKey);

    return sessionStorage.getItem(this.sessionKey) === 'true';

  }

  private getUserSession(): LoggedInUser | null {

    localStorage.removeItem(this.userSessionKey);

    const savedUser =
      sessionStorage.getItem(this.userSessionKey);

    if (!savedUser) {
      return null;
    }

    try {
      const parsedUser =
        JSON.parse(savedUser) as Partial<LoggedInUser>;

      return this.normalizeLoggedInUser(parsedUser);
    } catch {
      return null;
    }

  }

  private setUserSession(user: LoggedInUser): void {

    sessionStorage.setItem(
      this.userSessionKey,
      JSON.stringify(user)
    );

    this.userState.next(user);

  }

  private getRegisteredUsers(): RegisteredUser[] {

    const savedUsers =
      localStorage.getItem(this.usersKey);

    if (!savedUsers) {
      return [];
    }

    try {
      const parsedUsers =
        JSON.parse(savedUsers) as unknown;

      return Array.isArray(parsedUsers)
        ? parsedUsers
            .map(user =>
              this.normalizeRegisteredUser(user as Partial<RegisteredUser>)
            )
            .filter(
              (user): user is RegisteredUser =>
                Boolean(user.email && user.password)
            )
        : [];
    } catch {
      return [];
    }

  }

  private saveRegisteredUsers(users: RegisteredUser[]): void {

    localStorage.setItem(
      this.usersKey,
      JSON.stringify(users)
    );

  }

  private normalizeRegisteredUser(
    user: Partial<RegisteredUser>
  ): RegisteredUser {

    return {
      id:
        user.id ||
        `USR${Date.now().toString().slice(-8)}`,
      name: user.name || '',
      email: this.normalizeEmail(user.email || ''),
      countryCode: user.countryCode || '+91',
      phone: user.phone || '',
      password: user.password || '',
      registeredAt:
        user.registeredAt ||
        new Date().toISOString()
    };

  }

  private normalizeLoggedInUser(
    user: Partial<LoggedInUser>
  ): LoggedInUser | null {

    const email =
      this.normalizeEmail(user.email || '');

    if (!email) {
      return null;
    }

    return {
      id: user.id || '',
      name: user.name || '',
      email,
      countryCode: user.countryCode || '+91',
      phone: user.phone || '',
      registeredAt:
        user.registeredAt ||
        new Date().toISOString()
    };

  }

  private toLoggedInUser(user: RegisteredUser): LoggedInUser {

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      countryCode: user.countryCode,
      phone: user.phone,
      registeredAt: user.registeredAt
    };

  }

  private normalizeEmail(email: string): string {

    return email.replace(/\s+/g, '').toLowerCase();

  }
}
