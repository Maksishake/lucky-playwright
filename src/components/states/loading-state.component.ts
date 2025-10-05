/**
 * Loading State Component
 * Компонент состояния загрузки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class LoadingStateComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Loading State');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость компонента
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  // ========== ЛОКАТОРЫ ==========

  get spinner(): Locator {
    return this.root.locator('.spinner, .loader, .loading-spinner');
  }

  get overlay(): Locator {
    return this.root.locator('.loading-overlay, .overlay, .loading-backdrop');
  }

  get progressBar(): Locator {
    return this.root.locator('.progress-bar, .progress, .loading-progress');
  }

  get loadingText(): Locator {
    return this.root.locator('.loading-text, .loading-message, .text');
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
   * Дождаться завершения загрузки
   */
  async waitForLoadingComplete(): Promise<void> {
    logger.step('Waiting for loading to complete');
    try {
      await this.root.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM });
      logger.success('Loading completed');
    } catch (error) {
      logger.warning('Loading timeout - continuing');
    }
  }

  /**
   * Дождаться появления загрузки
   */
  async waitForLoadingStart(): Promise<void> {
    logger.step('Waiting for loading to start');
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить текст загрузки
   */
  async getLoadingText(): Promise<string | null> {
    try {
      return await this.loadingText.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить прогресс загрузки
   */
  async getProgress(): Promise<number | null> {
    try {
      const progressText = await this.progressBar.textContent();
      if (progressText) {
        const match = progressText.match(/(\d+)%/);
        return match ? parseInt(match[1], 10) : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Получить информацию о загрузке
   */
  async getLoadingInfo(): Promise<{
    text: string | null;
    progress: number | null;
    hasOverlay: boolean;
  }> {
    const [text, progress, hasOverlay] = await Promise.all([
      this.getLoadingText(),
      this.getProgress(),
      this.hasOverlay()
    ]);

    return { text, progress, hasOverlay };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, идет ли загрузка
   */
  async isLoading(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли оверлей
   */
  async hasOverlay(): Promise<boolean> {
    return await this.overlay.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли спиннер
   */
  async hasSpinner(): Promise<boolean> {
    return await this.spinner.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли прогресс-бар
   */
  async hasProgressBar(): Promise<boolean> {
    return await this.progressBar.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли текст загрузки
   */
  async hasLoadingText(): Promise<boolean> {
    return await this.loadingText.isVisible().catch(() => false);
  }
}
