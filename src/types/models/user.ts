/**
 * User type definitions
 */

export interface User {
  email: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  country?: string;
  currency?: string;
  promoCode?: string;
}

export type UserRole = 'user' | 'admin' | 'vip';

export interface AuthEmailCredentials {
  email: string;
  password: string;
}

export interface AuthPhoneCredentials {
  phone: string;
  password: string;
}

