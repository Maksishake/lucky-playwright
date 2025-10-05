export const WalletTestData = {
  balances: {
    zero: '0',
    low: '100',
    medium: '1000',
    high: '10000',
    veryHigh: '100000'
  },
  transactions: {
    deposit: {
      type: 'deposit',
      status: 'completed',
      amount: '1000',
      currency: 'RUB',
      method: 'P2P'
    },
    withdrawal: {
      type: 'withdrawal',
      status: 'pending',
      amount: '500',
      currency: 'RUB',
      method: 'BANK_TRANSFER'
    },
    bonus: {
      type: 'bonus',
      status: 'completed',
      amount: '100',
      currency: 'RUB',
      method: 'PROMO_CODE'
    }
  },
  limits: {
    daily: {
      deposit: '50000',
      withdrawal: '25000'
    },
    monthly: {
      deposit: '500000',
      withdrawal: '250000'
    }
  },
  currencies: {
    RUB: {
      name: 'Russian Ruble',
      symbol: '₽',
      rate: '1'
    },
    USD: {
      name: 'US Dollar',
      symbol: '$',
      rate: '0.011'
    },
    EUR: {
      name: 'Euro',
      symbol: '€',
      rate: '0.010'
    }
  }
};
