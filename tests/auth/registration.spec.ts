import { test, expect } from '@playwright/test';
import { Routes } from '../../config/routes';
import { PageObjectFactory } from '../../helpers/factories/page-object-factory';
import { RegistrationModal } from '../../pages/modals/registration.modal';

test.describe('Регистрация', () => {
  let factory: PageObjectFactory;
  let registrationModal: RegistrationModal;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    registrationModal = new RegistrationModal(page);
    
    await page.goto(Routes.HOME);
  });

  test('Успешная регистрация по email', async ({ page }) => {
    await registrationModal.registerWithEmailAndPassword(
      'newuser@example.com',
      'password123'
    );
    
    // Проверяем успешную регистрацию
    await expect(page.locator('.success-message, .registration-success')).toBeVisible();
  });

  test('Успешная регистрация по телефону', async ({ page }) => {
    await registrationModal.registerWithPhoneAndPassword(
      '+380987654321',
      'password123'
    );
    
    // Проверяем успешную регистрацию
    await expect(page.locator('.success-message, .registration-success')).toBeVisible();
  });

  test('Регистрация с промокодом', async ({ page }) => {
    await registrationModal.registerWithEmailPasswordAndPromo(
      'newuser@example.com',
      'password123',
      'WELCOME2024'
    );
    
    // Проверяем успешную регистрацию
    await expect(page.locator('.success-message, .registration-success')).toBeVisible();
  });

  test('Ошибка при регистрации с существующим email', async ({ page }) => {
    await registrationModal.registerWithEmailAndPassword(
      'test@example.com', // Существующий email
      'password123'
    );
    
    // Проверяем ошибку
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Ошибка при несовпадении паролей', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('newuser@example.com');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.fillField('confirmPassword', 'differentpassword');
    await registrationModal.submitRegistration();
    
    // Проверяем ошибку
    await expect(page.locator('.error-text, .validation-error')).toBeVisible();
  });

  test('Очистка полей формы', async ({ page }) => {
    await registrationModal.registerWithEmail();
    await registrationModal.fillEmailField('test@example.com');
    await registrationModal.fillPasswordField('password123');
    await registrationModal.clearAllFields();
    
    // Проверяем, что поля очищены
    const emailValue = await page.locator('input[name="email"]').inputValue();
    const passwordValue = await page.locator('input[name="password"]').inputValue();
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');
  });
});
