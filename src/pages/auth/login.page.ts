/**
 * Login Page
 * UI-слой: только локаторы и базовые действия с элементами
 * Бизнес-логика (login, logout) вынесена в AuthService
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { logger } from '@utils/logger.util';
import { Waiter } from '@utils/waiter.util';
import { TIMEOUTS } from '@config/constants';

export class LoginPage extends BasePage {
  protected url = '/';
  protected pageName = 'Login Page';

  // ========== ЛОКАТОРЫ (проверенные из рабочих тестов) ==========
  
  get loginModal(): Locator {
    return this.page.locator('#modal-auth');
  }

  get loginOpenButton(): Locator {
    return this.page.getByRole('button', { name: 'Увійти' });
  }

  get closeButton(): Locator {
    return this.page.locator('#modal-auth .modal-close');
  }

  get emailInput(): Locator {
    return this.page.locator('#modal-auth #email_login');
  }

  get phoneInput(): Locator {
    return this.page.locator('#modal-auth #login-phone');
  }

  get passwordInput(): Locator {
    return this.page.locator('#modal-auth #password-login');
  }

  get submitButton(): Locator {
    return this.page.locator('#modal-auth button:has-text("Вхід")');
  }

  get errorMessage(): Locator {
    return this.page.locator('#modal-auth .error-text');
  }

  get loginTab(): Locator {
    return this.page.locator('//*[@id="tab-login"]/div/div[2]/label/button');
  }

  get signupTab(): Locator {
    return this.page.locator('//*[@id="tab-login"]/div/div[1]/label/button');
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.loginModal.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    logger.debug(`Waiting for ${this.constructor.name} to load`);
    await this.loginModal.waitFor({ state: 'visible', timeout });
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {
      logger.debug('Network idle timeout - continuing');
    });
    await Waiter.waitForLoaderToDisappear(this.page, timeout);
    logger.success(`${this.constructor.name} loaded`);
  }

  async isOpen(): Promise<boolean> {
    return await this.isLoaded();
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  async open(): Promise<void> {
    logger.step('Opening login modal');
    await this.loginOpenButton.click();
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    logger.step('Closing login modal');
    await this.closeButton.click();
    await expect(this.loginModal).toBeHidden({ timeout: TIMEOUTS.SHORT });
  }

  async switchToLoginTab(): Promise<void> {
    const isVisible = await this.loginTab.isVisible().catch(() => false);
    if (isVisible) {
      await this.loginTab.click();
      await this.page.waitForTimeout(300);
    }
  }

  async switchToSignupTab(): Promise<void> {
    const isVisible = await this.signupTab.isVisible().catch(() => false);
    if (isVisible) {
      await this.signupTab.click();
      await this.page.waitForTimeout(300);
    }
  }

  // ========== ЗАПОЛНЕНИЕ ПОЛЕЙ ==========

  async fillEmail(email: string): Promise<void> {
    logger.debug(`Filling email: ${email}`);
    await this.switchToLoginTab();
    await this.emailInput.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    logger.debug(`Filling phone: ${phone}`);
    await this.switchToLoginTab();
    await this.phoneInput.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.phoneInput.clear();
    await this.phoneInput.fill(phone);
  }

  async fillPassword(password: string): Promise<void> {
    logger.debug('Filling password');
    await this.passwordInput.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clearForm(): Promise<void> {
    await this.emailInput.clear().catch(() => {});
    await this.phoneInput.clear().catch(() => {});
    await this.passwordInput.clear().catch(() => {});
  }

  // ========== ДЕЙСТВИЯ С ФОРМОЙ ==========

  async submit(): Promise<void> {
    logger.step('Submitting login form');
    await this.submitButton.click();
    await Promise.race([
      this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}),
      this.page.waitForTimeout(3000)
    ]);
  }

  /**
   * Алиас для обратной совместимости
   */
  async submitLogin(): Promise<void> {
    await this.submit();
  }

  // ========== ПРОВЕРКИ ОШИБОК ==========

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async getErrorMessage(): Promise<string> {
    try {
      return await this.errorMessage.innerText();
    } catch {
      return '';
    }
  }

  // ========== ПРОВЕРКИ ВИДИМОСТИ ==========

  async isEmailVisible(): Promise<boolean> {
    return await this.emailInput.isVisible().catch(() => false);
  }

  async isPhoneVisible(): Promise<boolean> {
    return await this.phoneInput.isVisible().catch(() => false);
  }

  async isLoginTabActive(): Promise<boolean> {
    try {
      const classList = await this.loginTab.getAttribute('class');
      return classList?.includes('active') || false;
    } catch {
      return false;
    }
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    try {
      return await this.submitButton.isEnabled();
    } catch {
      return false;
    }
  }
}
