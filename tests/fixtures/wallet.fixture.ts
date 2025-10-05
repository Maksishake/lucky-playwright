/**
 * Wallet Fixture
 * Фикстура для тестов кошелька
 */

import { test as base } from '@playwright/test';
import { WalletPage } from '../../src/pages/wallet/wallet.page';

type WalletFixtures = {
  walletPage: WalletPage;
};

export const test = base.extend<WalletFixtures>({
  walletPage: async ({ page }, use) => {
    const walletPage = new WalletPage(page);
    await use(walletPage);
  },
});

export { expect } from '@playwright/test';
