import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { RegistrationModal } from '../../pages/modals/registration.modal';

test.describe('Негативные тесты регистрации', () => {
  let factory: PageObjectFactory;
  let registrationModal: RegistrationModal;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    registrationModal = new RegistrationModal(page);
    
    await page.goto(Routes.HOME);
  });

  test('Регистрация с неверным форматом email', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('invalid-email');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Регистрация с коротким паролем', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('test@example.com');
    await registrationModal.fillPasswordField('123');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Регистрация с несовпадающими паролями', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('test@example.com');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.fillField('confirmPassword', 'differentpassword');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Регистрация с пустыми полями', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Регистрация с неверным форматом телефона', async ({ page }) => {
    await registrationModal.registerWithPhone();
    await registrationModal.fillPhoneField('invalid-phone');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Регистрация с неверным промокодом', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('test@example.com');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.fillPromoCodeField('INVALID_PROMO');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку валидации
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });
});
