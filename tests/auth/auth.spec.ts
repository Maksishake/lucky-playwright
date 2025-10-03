import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { DomCleaner } from '../../helpers/utils/dom-cleaner'; 
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../helpers/commands/auth/auth-commands'; 

/**
 * Тесты авторизации
 * Проверяют различные сценарии входа в систему
 */
test.describe('Авторизация', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test.afterEach(async ({ page }) => {
    try {
      const domCleaner = new DomCleaner(page);
      await domCleaner.clearErrorMessages();
    } catch (error) {
      console.log('Очистка DOM пропущена из-за навигации:', error.message); 
    }
  });

  // ========== ПОЗИТИВНЫЕ ТЕСТЫ ==========

  test('Успешная авторизация по email', async ({ page }) => {
    const response = await authCommands.loginWithValidCredentials();
    
    expect(response).toBeDefined();
    const json = await response.json();
    
    expect(json.serverMemo.errors).toBeUndefined();
    expect(json.effects.html).not.toContain('The login email field is required');
    
    // Проверяем, что пользователь авторизован
    const isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('Успешная авторизация по телефону', async ({ page }) => {
    const response = await authCommands.loginWithValidPhone();
    
    expect(response).toBeDefined();
    const json = await response.json();
    
    expect(json.serverMemo.errors).toBeUndefined();
    expect(json.effects.html).not.toContain('The login email field is required');
    
    // Проверяем, что пользователь авторизован
    const isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  // ========== НЕГАТИВНЫЕ ТЕСТЫ ==========

  test('Авторизация с неверным email', async ({ page }) => {
    const response = await authCommands.loginWithInvalidCredentials();
    
    if (response) {
      const json = await response.json();
      expect(json.serverMemo.errors).toBeDefined();
    }
    
    // Проверяем, что пользователь НЕ авторизован
    const isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  test('Авторизация с неверным паролем', async ({ page }) => {
    const response = await authCommands.loginWithWrongPassword();
    
    if (response) {
      const json = await response.json();
      expect(json.serverMemo.errors).toBeDefined();
    }
    
    // Проверяем, что пользователь НЕ авторизован
    const isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  test('Авторизация с пустым email', async ({ page }) => {
    const response = await authCommands.loginWithEmptyEmail();
    
    if (response) {
      const json = await response.json();
      expect(json.serverMemo.errors).toBeDefined();
    }
    
    // Проверяем наличие сообщения об ошибке в модальном окне
    const loginModal = factory.createLoginModal();
    const hasError = await loginModal.hasErrorMessage();
    expect(hasError).toBeTruthy();
  });

  test('Авторизация с неверным форматом email', async ({ page }) => {
    const response = await authCommands.loginWithInvalidEmailFormat();
    
    if (response) {
      const json = await response.json();
      expect(json.serverMemo.errors).toBeDefined();
    }
    
    // Проверяем наличие сообщения об ошибке в модальном окне
    const loginModal = factory.createLoginModal();
    const hasError = await loginModal.hasErrorMessage();
    expect(hasError).toBeTruthy();
  });

  // ========== ТЕСТЫ ВЫХОДА ==========

  test('Успешный выход из системы', async ({ page }) => {
    // Сначала авторизуемся
    await authCommands.loginWithValidCredentials();
    
    let isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Выходим
    await authCommands.logout();
    
    // Проверяем, что пользователь вышел
    isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  // ========== ТЕСТЫ СЕССИИ ==========

  test('Авторизация сохраняется после обновления страницы', async ({ page }) => {
    await authCommands.loginWithValidCredentials();
    
    let isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Обновляем страницу
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Проверяем, что пользователь все еще авторизован
    isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('Авторизация сохраняется при переходе между страницами', async ({ page }) => {
    await authCommands.loginWithValidCredentials();
    
    let isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    
    // Переходим на другую страницу
    await page.goto(Routes.SLOTS);
    await page.waitForLoadState('networkidle');
    
    // Проверяем, что пользователь все еще авторизован
    isLoggedIn = await authCommands.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });
});