/**
 * Banner Atom
 * Атомарный компонент для баннера
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';

export class BannerComponent extends BaseComponent {
  constructor(page: Page, banner: Locator) {
    super(page, banner, 'Banner');
  }

  // ========== ЛОКАТОРЫ ==========

  get title(): Locator {
    return this.root.locator('h1, .banner-title, .title');
  }

  get subtitle(): Locator {
    return this.root.locator('p, .banner-subtitle, .subtitle');
  }

  get image(): Locator {
    return this.root.locator('img');
  }

  get button(): Locator {
    return this.root.locator('button, .banner-button, .cta-button');
  }

  get overlay(): Locator {
    return this.root.locator('.banner-overlay, .overlay');
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

  /**
   * Проверить загрузку компонента
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.title.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: 5000 });
    await this.title.waitFor({ state: 'visible', timeout: 3000 });
    logger.success('Banner component loaded');
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на кнопку баннера
   */
  async clickButton(): Promise<void> {
    logger.step('Clicking banner button');
    await this.button.scrollIntoViewIfNeeded();
    await this.button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на баннер
   */
  async hover(): Promise<void> {
    logger.step('Hovering over banner');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить заголовок баннера
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить подзаголовок баннера
   */
  async getSubtitle(): Promise<string | null> {
    try {
      return await this.subtitle.textContent();
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
   * Получить полную информацию о баннере
   */
  async getBannerInfo(): Promise<{
    title: string | null;
    subtitle: string | null;
    imageSrc: string | null;
    buttonText: string | null;
  }> {
    const [title, subtitle, imageSrc, buttonText] = await Promise.all([
      this.getTitle(),
      this.getSubtitle(),
      this.getImageSrc(),
      this.getButtonText()
    ]);

    return { title, subtitle, imageSrc, buttonText };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, есть ли кнопка
   */
  async hasButton(): Promise<boolean> {
    return await this.button.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли изображение
   */
  async hasImage(): Promise<boolean> {
    return await this.image.isVisible().catch(() => false);
  }
}
