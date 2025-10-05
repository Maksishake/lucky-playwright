export const ValidationTestData = {
  email: {
    valid: [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com'
    ],
    invalid: [
      'invalid-email',
      '@example.com',
      'user@',
      'user@.com',
      'user..name@example.com',
      'user@example..com'
    ]
  },
  password: {
    valid: [
      'password123',
      'MySecure123!',
      'VeryLongPassword123',
      'Pass1234'
    ],
    invalid: [
      '123',
      'password',
      'PASSWORD',
      '12345678',
      'a'.repeat(257)
    ]
  },
  phone: {
    valid: [
      '+380123456789',
      '+380987654321',
      '380123456789',
      '0123456789'
    ],
    invalid: [
      'invalid-phone',
      '123',
      'abc',
      '+3801234567890',
      '38012345678'
    ]
  },
  promoCode: {
    valid: [
      'WELCOME2024',
      'BONUS2024',
      'NEWUSER2024',
      'PROMO123'
    ],
    invalid: [
      'INVALID_PROMO',
      'expired',
      'used',
      '123',
      'a'.repeat(100)
    ]
  }
};
