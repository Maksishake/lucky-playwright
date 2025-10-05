/**
 * Transaction type definitions
 */

export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'card' | 'crypto' | 'bank' | 'ewallet';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  completedAt?: Date;
}

export interface DepositRequest {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

