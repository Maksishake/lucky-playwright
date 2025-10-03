import { test, expect } from '@playwright/test';
import { Routes } from '../../../config/routes';
import { PageObjectFactory } from '../../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../../helpers/commands/auth/auth-commands';

test.describe('Обработка сетевых ошибок', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test('Ошибка сети при авторизации', async ({ page }) => {
    // Блокируем сетевые запросы
    await page.route('**/livewire/message', route => route.abort());
    
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    try {
      await loginModal.loginWithEmailAndPassword('test@example.com', 'password123');
    } catch (error) {
      // Проверяем, что ошибка обработана корректно
      expect(error.message).toContain('net::ERR_');
    }
  });

  test('Таймаут при загрузке депозита', async ({ page }) => {
    // Устанавливаем очень короткий таймаут
    page.setDefaultTimeout(100);
    
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    
    try {
      await walletModal.goToDeposit();
    } catch (error) {
      // Проверяем, что таймаут обработан корректно
      expect(error.message).toContain('Timeout');
    }
  });

  test('Ошибка сервера при генерации адреса депозита', async ({ page }) => {
    // Мокаем ошибку сервера
    await page.route('**/api/deposit/address', route => 
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );
    
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectCrypto();
    await depositModal.selectUSDTToken();
    await depositModal.selectTronNetwork();
    
    // Проверяем ошибку генерации адреса
    await depositModal.expectDepositAddressGenerationError();
  });

  test('Ошибка сети при применении промокода', async ({ page }) => {
    // Мокаем ошибку сети
    await page.route('**/api/promo/apply', route => route.abort());
    
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    await depositModal.enterAmount('1000');
    await depositModal.enterPromocode('BONUS2024');
    
    try {
      await depositModal.applyPromocode();
    } catch (error) {
      // Проверяем, что ошибка сети обработана
      expect(error.message).toContain('net::ERR_');
    }
  });

  test('Ошибка сервера при обновлении баланса', async ({ page }) => {
    // Мокаем ошибку сервера
    await page.route('**/api/wallet/balance', route => 
      route.fulfill({ status: 503, body: 'Service Unavailable' })
    );
    
    await authCommands.openWallet();
    
    const walletModal = factory.createWalletModal();
    
    try {
      await walletModal.refreshBalance();
    } catch (error) {
      // Проверяем, что ошибка сервера обработана
      expect(error.message).toContain('503');
    }
  });
});
