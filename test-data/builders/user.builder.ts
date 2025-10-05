/**
 * User Builder
 * Test Data Builder pattern for User objects
 */

import { User } from '../../types/models/user';

export class UserBuilder {
  private user: Partial<User> = {
    email: `test.user.${Date.now()}@example.com`,
    password: 'Test123!@#',
    phone: '+380501234567',
    firstName: 'Test',
    lastName: 'User',
    country: 'Ukraine',
    currency: 'USD',
  };

  /**
   * Create default user
   */
  static default(): UserBuilder {
    return new UserBuilder();
  }

  /**
   * Create user with specific email
   */
  static withEmail(email: string): UserBuilder {
    return new UserBuilder().setEmail(email);
  }

  /**
   * Set email
   */
  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  /**
   * Set password
   */
  setPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  /**
   * Set phone
   */
  setPhone(phone: string): this {
    this.user.phone = phone;
    return this;
  }

  /**
   * Set first name
   */
  setFirstName(firstName: string): this {
    this.user.firstName = firstName;
    return this;
  }

  /**
   * Set last name
   */
  setLastName(lastName: string): this {
    this.user.lastName = lastName;
    return this;
  }

  /**
   * Set promo code
   */
  withPromoCode(promoCode: string): this {
    this.user.promoCode = promoCode;
    return this;
  }

  /**
   * Set currency
   */
  withCurrency(currency: string): this {
    this.user.currency = currency;
    return this;
  }

  /**
   * Build user object
   */
  build(): User {
    if (!this.user.email || !this.user.password) {
      throw new Error('User must have email and password');
    }
    
    return this.user as User;
  }
}

