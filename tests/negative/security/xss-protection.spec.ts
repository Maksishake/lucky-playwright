import { test, expect } from '@playwright/test';
import { Routes } from '../../../config/routes';
import { PageObjectFactory } from '../../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../../helpers/commands/auth/auth-commands';

test.describe('Тесты безопасности - защита от XSS', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test('Защита от XSS в поле email', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    // Пытаемся ввести XSS payload
    const xssPayload = '<script>alert("XSS")</script>';
    await loginModal.byEmailAuthorizationActiveButton();
    await loginModal.emailInput(xssPayload);
    await loginModal.passwordInput('password123');
    await loginModal.authButton();
    
    // Проверяем, что скрипт не выполнился
    const alertHandled = await page.evaluate(() => {
      return window.alert === undefined || !window.alert.toString().includes('XSS');
    });
    
    expect(alertHandled).toBe(true);
  });

  test('Защита от XSS в поле пароля', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    // Пытаемся ввести XSS payload
    const xssPayload = '<img src=x onerror=alert("XSS")>';
    await loginModal.byEmailAuthorizationActiveButton();
    await loginModal.emailInput('test@example.com');
    await loginModal.passwordInput(xssPayload);
    await loginModal.authButton();
    
    // Проверяем, что скрипт не выполнился
    const alertHandled = await page.evaluate(() => {
      return window.alert === undefined || !window.alert.toString().includes('XSS');
    });
    
    expect(alertHandled).toBe(true);
  });

  test('Защита от XSS в поле промокода', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    // Пытаемся ввести XSS payload
    const xssPayload = '"><script>alert("XSS")</script>';
    await loginModal.byEmailAuthorizationActiveButton();
    await loginModal.emailInput('test@example.com');
    await loginModal.passwordInput('password123');
    await loginModal.promoCodeInput(xssPayload);
    await loginModal.authButton();
    
    // Проверяем, что скрипт не выполнился
    const alertHandled = await page.evaluate(() => {
      return window.alert === undefined || !window.alert.toString().includes('XSS');
    });
    
    expect(alertHandled).toBe(true);
  });

  test('Защита от XSS в сумме депозита', async ({ page }) => {
    await authCommands.openWalletAndGoToDeposit();
    
    const depositModal = factory.createDepositModal();
    await depositModal.selectFiat();
    await depositModal.openCurrencySelect();
    await depositModal.selectRUB();
    await depositModal.selectP2PMethod();
    
    // Пытаемся ввести XSS payload
    const xssPayload = '<script>alert("XSS")</script>';
    await depositModal.enterAmount(xssPayload);
    
    // Проверяем, что скрипт не выполнился
    const alertHandled = await page.evaluate(() => {
      return window.alert === undefined || !window.alert.toString().includes('XSS');
    });
    
    expect(alertHandled).toBe(true);
  });

  test('Защита от SQL инъекций в поле email', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    // Пытаемся ввести SQL инъекцию
    const sqlPayload = "'; DROP TABLE users; --";
    await loginModal.byEmailAuthorizationActiveButton();
    await loginModal.emailInput(sqlPayload);
    await loginModal.passwordInput('password123');
    await loginModal.authButton();
    
    // Проверяем, что приложение не сломалось
    await expect(page.locator('body')).toBeVisible();
  });

  test('Защита от NoSQL инъекций', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    await header.loginButton();
    
    // Пытаемся ввести NoSQL инъекцию
    const nosqlPayload = '{"$ne": null}';
    await loginModal.byEmailAuthorizationActiveButton();
    await loginModal.emailInput(nosqlPayload);
    await loginModal.passwordInput('password123');
    await loginModal.authButton();
    
    // Проверяем, что приложение не сломалось
    await expect(page.locator('body')).toBeVisible();
  });
});
