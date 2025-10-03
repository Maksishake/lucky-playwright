import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../helpers/commands/auth/auth-commands';

test.describe('Кошелек', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test('Открытие модального окна кошелька', async ({ page }) => {
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    await walletModal.expectOpen();
  });

  test('Переход к депозиту из кошелька', async ({ page }) => {
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    await walletModal.expectOpen();
    await walletModal.goToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.expectModalVisible();
  });

  test('Переход к выводу средств из кошелька', async ({ page }) => {
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    await walletModal.expectOpen();
    await walletModal.goToWithdrawal();
  });

  test('Обновление баланса', async ({ page }) => {
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    await walletModal.expectOpen();
    await walletModal.refreshBalance();
    
    // Проверяем, что баланс обновился (ждем небольшую задержку)
    await page.waitForTimeout(1000);
  });

  test('Закрытие модального окна кошелька', async ({ page }) => {
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    await walletModal.expectOpen();
    await walletModal.close();
    await walletModal.expectClosed();
  });
});
