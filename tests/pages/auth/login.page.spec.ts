/**
 * Login Page Tests
 * Тесты страницы авторизации
 */

import { test, expect } from '../fixtures/auth.fixture';

test.describe('Login Page', () => {
  test('should display login form', async ({ loginPage }) => {
    await loginPage.navigate();
    await expect(loginPage.isLoaded()).resolves.toBe(true);
  });

  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password');
    await expect(loginPage.isLoggedIn()).resolves.toBe(true);
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.hasLoginError()).resolves.toBe(true);
  });
});
