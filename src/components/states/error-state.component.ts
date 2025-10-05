/**
 * Error State Component
 * Компонент состояния ошибки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class ErrorStateComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Error State');
  }

  // ========== ЛОКАТОРЫ ==========

  get title(): Locator {
    return this.root.locator('h3, .error-title, .error-heading, .title');
  }

  get description(): Locator {
    return this.root.locator('p, .error-description, .error-text, .description');
  }

  get retryButton(): Locator {
    return this.root.locator('button.retry, .retry-button, .error-retry, button:has-text("Retry"), button:has-text("Повторить")');
  }

  get closeButton(): Locator {
    return this.root.locator('button.close, .close-button, .error-close, button:has-text("Close"), button:has-text("Закрыть")');
  }

  get icon(): Locator {
    return this.root.locator('.icon, .error-icon, .warning-icon');
  }

  get errorCode(): Locator {
    return this.root.locator('.error-code, .code, .status-code');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на кнопку повтора
   */
  async clickRetry(): Promise<void> {
    logger.step('Clicking retry button');
    await this.retryButton.scrollIntoViewIfNeeded();
    await this.retryButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кнопку закрытия
   */
  async clickClose(): Promise<void> {
    logger.step('Clicking close button');
    await this.closeButton.scrollIntoViewIfNeeded();
    await this.closeButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на состояние ошибки
   */
  async hover(): Promise<void> {
    logger.step('Hovering over error state');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить заголовок ошибки
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить описание ошибки
   */
  async getDescription(): Promise<string | null> {
    try {
      return await this.description.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить код ошибки
   */
  async getErrorCode(): Promise<string | null> {
    try {
      return await this.errorCode.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить текст кнопки повтора
   */
  async getRetryButtonText(): Promise<string | null> {
    try {
      return await this.retryButton.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить текст кнопки закрытия
   */
  async getCloseButtonText(): Promise<string | null> {
    try {
      return await this.closeButton.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить полную информацию об ошибке
   */
  async getErrorInfo(): Promise<{
    title: string | null;
    description: string | null;
    errorCode: string | null;
    retryButtonText: string | null;
    closeButtonText: string | null;
  }> {
    const [title, description, errorCode, retryButtonText, closeButtonText] = await Promise.all([
      this.getTitle(),
      this.getDescription(),
      this.getErrorCode(),
      this.getRetryButtonText(),
      this.getCloseButtonText()
    ]);

    return { title, description, errorCode, retryButtonText, closeButtonText };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видимо ли состояние ошибки
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли ошибка
   */
  async hasError(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Проверить, есть ли кнопка повтора
   */
  async hasRetryButton(): Promise<boolean> {
    return await this.retryButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка закрытия
   */
  async hasCloseButton(): Promise<boolean> {
    return await this.closeButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли иконка
   */
  async hasIcon(): Promise<boolean> {
    return await this.icon.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли код ошибки
   */
  async hasErrorCode(): Promise<boolean> {
    return await this.errorCode.isVisible().catch(() => false);
  }
}
