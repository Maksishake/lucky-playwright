/**
 * Application Constants
 * Centralized magic numbers and configuration values
 */

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTRA_LONG: 60000,
} as const;

export const DEPOSIT_LIMITS = {
  MIN: 100,
  MAX: 100000,
} as const;

export const WITHDRAWAL_LIMITS = {
  MIN: 500,
  MAX: 50000,
} as const;

export const BET_LIMITS = {
  MIN: 10,
  MAX: 10000,
} as const;

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB',
  UAH: 'UAH',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'card',
  CRYPTO: 'crypto',
  BANK: 'bank',
  EWALLET: 'ewallet',
} as const;

export const STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
} as const;

