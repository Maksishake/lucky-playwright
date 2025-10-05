export const BonusTestData = {
  promoCodes: {
    welcome: {
      code: 'WELCOME2024',
      type: 'welcome',
      amount: '500',
      currency: 'RUB',
      minDeposit: '1000',
      maxBonus: '500',
      wagering: '35x'
    },
    deposit: {
      code: 'DEPOSIT2024',
      type: 'deposit',
      amount: '1000',
      currency: 'RUB',
      minDeposit: '2000',
      maxBonus: '1000',
      wagering: '40x'
    },
    weekend: {
      code: 'WEEKEND2024',
      type: 'weekend',
      amount: '200',
      currency: 'RUB',
      minDeposit: '500',
      maxBonus: '200',
      wagering: '30x'
    }
  },
  bonuses: {
    firstDeposit: {
      name: 'First Deposit Bonus',
      amount: '100%',
      maxAmount: '10000',
      currency: 'RUB',
      wagering: '35x',
      validDays: 30
    },
    reload: {
      name: 'Reload Bonus',
      amount: '50%',
      maxAmount: '5000',
      currency: 'RUB',
      wagering: '40x',
      validDays: 7
    },
    cashback: {
      name: 'Cashback Bonus',
      amount: '10%',
      maxAmount: '1000',
      currency: 'RUB',
      wagering: '1x',
      validDays: 1
    }
  },
  terms: {
    wagering: {
      slots: '100%',
      liveCasino: '10%',
      tableGames: '10%',
      sports: '5%'
    },
    restrictions: {
      maxBet: '5',
      gameRestrictions: ['Progressive Slots', 'Live Games'],
      timeLimit: '30 days'
    }
  }
};
