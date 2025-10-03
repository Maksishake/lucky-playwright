import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { AuthCommands } from '../../helpers/commands/auth/auth-commands';

test.describe('Валидация ввода', () => {
  let factory: PageObjectFactory;
  let authCommands: AuthCommands;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authCommands = new AuthCommands(page, factory);
    
    await page.goto(Routes.HOME);
  });

  test('Валидация email при авторизации', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();

    
    // Тест с неверным форматом email

    
    // Проверяем наличие ошибки валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Валидация пустых полей', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
  
    
    // Попытка авторизации с пустыми полями
    
    // Проверяем наличие ошибки валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Валидация длины пароля', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
   
    
    // Тест с коротким паролем
    
    // Проверяем наличие ошибки валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Валидация промокода', async ({ page }) => {
    const header = factory.createHeader();
    const loginModal = factory.createLoginModal();
    
    
    // Тест с неверным промокодом
    
    // Проверяем наличие ошибки валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });
});
