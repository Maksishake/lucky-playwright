/**
 * Empty State Component
 * Компонент пустого состояния
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class EmptyStateComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Empty State');
  }

  // ========== ЛОКАТОРЫ ==========

  get image(): Locator {
    return this.root.locator('img, .empty-image, .no-results-image');
  }

  get title(): Locator {
    return this.root.locator('h3, .empty-title, .no-results-title, .title');
  }

  get description(): Locator {
    return this.root.locator('p, .empty-description, .no-results-description, .description');
  }

  get button(): Locator {
    return this.root.locator('button, .empty-button, .action-button, .cta-button');
  }

  get icon(): Locator {
    return this.root.locator('.icon, .empty-icon, .no-results-icon');
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
   * Кликнуть на кнопку действия
   */
  async clickActionButton(): Promise<void> {
    logger.step('Clicking empty state action button');
    await this.button.scrollIntoViewIfNeeded();
    await this.button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на пустое состояние
   */
  async hover(): Promise<void> {
    logger.step('Hovering over empty state');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить заголовок пустого состояния
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить описание пустого состояния
   */
  async getDescription(): Promise<string | null> {
    try {
      return await this.description.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить текст кнопки
   */
  async getButtonText(): Promise<string | null> {
    try {
      return await this.button.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить URL изображения
   */
  async getImageSrc(): Promise<string | null> {
    try {
      return await this.image.getAttribute('src');
    } catch {
      return null;
    }
  }

  /**
   * Получить полную информацию о пустом состоянии
   */
  async getEmptyStateInfo(): Promise<{
    title: string | null;
    description: string | null;
    buttonText: string | null;
    imageSrc: string | null;
  }> {
    const [title, description, buttonText, imageSrc] = await Promise.all([
      this.getTitle(),
      this.getDescription(),
      this.getButtonText(),
      this.getImageSrc()
    ]);

    return { title, description, buttonText, imageSrc };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видимо ли пустое состояние
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли пустое состояние
   */
  async isEmpty(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Проверить, есть ли изображение
   */
  async hasImage(): Promise<boolean> {
    return await this.image.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка
   */
  async hasButton(): Promise<boolean> {
    return await this.button.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли иконка
   */
  async hasIcon(): Promise<boolean> {
    return await this.icon.isVisible().catch(() => false);
  }
}
