import { test, expect } from '@playwright/test';
import { Routes } from '../../../config/routes';
import { PageObjectFactory } from '../../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../../helpers/commands/auth/auth-commands';

test.describe('Негативные тесты - граничные значения', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test('Минимальная сумма депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('1'); // Минимальная сумма
    
    // Проверяем ошибку минимальной суммы
    await depositModal.expectMinimumAmountError();
  });

  test('Максимальная сумма депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('999999999'); // Максимальная сумма
    
    // Проверяем ошибку максимальной суммы
    await depositModal.expectMaximumAmountError();
  });

  test('Невалидная сумма депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('abc'); // Невалидная сумма
    
    // Проверяем ошибку невалидной суммы
    await depositModal.expectInvalidAmountError();
  });

  test('Отрицательная сумма депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('-100'); // Отрицательная сумма
    
    // Проверяем ошибку невалидной суммы
    await depositModal.expectInvalidAmountError();
  });

  test('Нулевая сумма депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('0'); // Нулевая сумма
    
    // Проверяем ошибку минимальной суммы
    await depositModal.expectMinimumAmountError();
  });
});