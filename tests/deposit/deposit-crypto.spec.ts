import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../helpers/commands/auth/auth-commands';

test.describe('Депозит - криптовалюта', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
    await authCommands.openWalletAndGoToDeposit();
  });

  test('Выбор USDT токена', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectCrypto();
    await depositModal.selectUSDTToken();
    await depositModal.selectTronNetwork();
    
    await depositModal.expectDepositAddressVisible();
  });

  test('Выбор BTC токена', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectCrypto();
    await depositModal.selectBTCToken();
    await depositModal.selectBitcoinNetwork();
    
    await depositModal.expectDepositAddressVisible();
  });

  test('Ошибка при выборе невалидного токена', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectCrypto();
    await depositModal.selectInvalidToken();
    
    await depositModal.expectInvalidTokenError();
  });

  test('Ошибка при выборе невалидной сети', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectCrypto();
    await depositModal.selectUSDTToken();
    await depositModal.selectInvalidNetwork();
    
    await depositModal.expectInvalidNetworkError();
  });
});
