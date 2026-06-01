export interface UserRegistration {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
}

export interface RegisteredUser extends UserRegistration {
  id: string;
  registeredAt: string;
}

export type LoggedInUser = Omit<RegisteredUser, 'password'>;
