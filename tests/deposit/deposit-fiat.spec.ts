import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../helpers/commands/auth/auth-commands';

test.describe('Депозит - фиат', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
    await authCommands.openWalletAndGoToDeposit();
  });

  test('Выбор RUB валюты', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    
    // Проверяем, что форма депозита доступна
    await expect(page.locator('#amount_RUB')).toBeVisible();
  });

  test('Ввод суммы депозита', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('1000');
    
    // Проверяем, что сумма введена
    const amountValue = await page.locator('#amount_RUB').inputValue();
    expect(amountValue).toBe('1000');
  });

  test('Выбор предустановленной суммы', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.selectAmountRadio(1);
    
    // Проверяем, что предустановленная сумма выбрана
    await expect(page.locator('#radio-item-1')).toBeChecked();
  });

  test('Применение промокода', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('1000');
    await depositModal.enterPromocode('BONUS2024');
    await depositModal.applyPromocode();
    
    await depositModal.expectPromoCodeApplied();
  });

  test('Ошибка при неверном промокоде', async ({ page }) => {
    const depositModal = factory.createDepositModal();
    
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('1000');
    await depositModal.enterPromocode('INVALID_PROMO');
    await depositModal.applyPromocode();
    
    await depositModal.expectPromoCodeError();
  });
});
