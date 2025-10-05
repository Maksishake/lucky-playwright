export const DepositTestData = {
  crypto: {
    tokens: {
      USDT: {
        name: 'USDT',
        networks: ['TRON', 'ETHEREUM', 'BSC'],
        minAmount: '10',
        maxAmount: '100000'
      },
      BTC: {
        name: 'BTC',
        networks: ['BITCOIN', 'LIGHTNING'],
        minAmount: '0.001',
        maxAmount: '10'
      },
      ETH: {
        name: 'ETH',
        networks: ['ETHEREUM', 'POLYGON'],
        minAmount: '0.01',
        maxAmount: '100'
      }
    },
    networks: {
      TRON: {
        name: 'TRON',
        fee: '1',
        confirmations: 12
      },
      BITCOIN: {
        name: 'BITCOIN',
        fee: '0.0001',
        confirmations: 6
      },
      ETHEREUM: {
        name: 'ETHEREUM',
        fee: '0.005',
        confirmations: 12
      }
    }
  },
  fiat: {
    currencies: {
      RUB: {
        name: 'RUB',
        symbol: '₽',
        minAmount: '100',
        maxAmount: '1000000'
      },
      USD: {
        name: 'USD',
        symbol: '$',
        minAmount: '10',
        maxAmount: '10000'
      },
      EUR: {
        name: 'EUR',
        symbol: '€',
        minAmount: '10',
        maxAmount: '10000'
      }
    },
    methods: {
      P2P: {
        name: 'P2P',
        fee: '0%',
        processingTime: '1-24 hours'
      },
      BANK_TRANSFER: {
        name: 'Bank Transfer',
        fee: '1%',
        processingTime: '1-3 days'
      },
      CARD: {
        name: 'Card',
        fee: '2%',
        processingTime: 'Instant'
      }
    }
  },
  amounts: {
    valid: ['100', '1000', '5000', '10000'],
    invalid: ['0', '-100', 'abc', '999999999'],
    boundary: {
      min: '1',
      max: '999999999'
    }
  },
  promoCodes: {
    valid: ['BONUS2024', 'WELCOME2024', 'NEWUSER2024'],
    invalid: ['INVALID_PROMO', 'EXPIRED', 'USED'],
    special: ['FIRST_DEPOSIT', 'VIP_BONUS', 'WEEKEND_SPECIAL']
  }
};
