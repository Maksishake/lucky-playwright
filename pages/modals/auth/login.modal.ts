import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Page Object для модального окна входа
 * UI-слой: локаторы + базовые действия
 */
export class LoginModal extends BaseModal {
  // ========== ЛОКАТОРЫ ==========
  
  private readonly modal: Locator;
  private readonly closeButton: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly tabLogin: Locator;
  private readonly tabSignup: Locator;

  constructor(page: Page) {
    super(page);
    
    // Инициализация локаторов
    this.modal = page.locator('#modal-auth');
    this.closeButton = page.locator('#modal-auth .modal-close');
    this.emailInput = page.locator('#modal-auth #email_login');
    this.phoneInput = page.locator('#modal-auth #login-phone');
    this.passwordInput = page.locator('#modal-auth #password-login');
    this.loginButton = page.locator('#modal-auth button:has-text("Вхід")');
    this.errorMessage = page.locator('#modal-auth .error-text');
    this.tabLogin = page.locator('//*[@id="tab-login"]/div/div[2]/label/button');
    this.tabSignup = page.locator('//*[@id="tab-login"]/div/div[1]/label/button');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ И СОСТОЯНИЯ ==========

  async isLoaded(): Promise<boolean> {
    return await this.modal.isVisible().catch(() => false);
  }

  async waitForLoad(): Promise<void> {
    await expect(this.modal).toBeVisible({ timeout: 10000 });
  }

  async isOpen(): Promise<boolean> {
    return await this.isLoaded();
  }

  async open(): Promise<void> {
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.modal).toBeHidden({ timeout: 5000 });
  }

  // ========== БАЗОВЫЕ UI ДЕЙСТВИЯ ==========

  /**
   * Заполнить поле email
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Заполнить поле телефона
   */
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  /**
   * Заполнить поле пароля
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Нажать кнопку входа
   */
  async clickSubmit(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Переключиться на таб входа
   */
  async clickLoginTab(): Promise<void> {
    await this.tabLogin.click();
  }

  /**
   * Переключиться на таб регистрации
   */
  async clickSignupTab(): Promise<void> {
    await this.tabSignup.click();
  }

  /**
   * Очистить форму
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.passwordInput.clear();
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ UI ==========

  /**
   * Проверить видимость поля email
   */
  async isEmailVisible(): Promise<boolean> {
    return await this.emailInput.isVisible().catch(() => false);
  }

  /**
   * Проверить видимость поля телефона
   */
  async isPhoneVisible(): Promise<boolean> {
    return await this.phoneInput.isVisible().catch(() => false);
  }

  /**
   * Проверить активность таба входа
   */
  async isLoginTabActive(): Promise<boolean> {
    const classList = await this.tabLogin.getAttribute('class');
    return classList?.includes('active') || false;
  }

  /**
   * Проверить видимость ошибки
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Получить текст ошибки
   */
  async getErrorText(): Promise<string> {
    return await this.errorMessage.innerText();
  }
}
