export const AuthTestData = {
  valid: {
    email: 'justshmv@gmail.com',
    phone: '+380123456789',
    password: '12345678',
    promoCode: 'WELCOME2024'
  },
  invalid: {
    wrongEmail: 'wrong@example.com',
    wrongPassword: 'wrongpassword',
    emptyString: '',
    invalidEmailFormat: 'invalid-email',
    shortPassword: '123',
    longPassword: 'a'.repeat(256)
  },
  registration: {
    email: 'newuser@example.com',
    phone: '+380987654321',
    password: 'newpassword123',
    confirmPassword: 'newpassword123',
    promoCode: 'NEWUSER2024'
  }
};
