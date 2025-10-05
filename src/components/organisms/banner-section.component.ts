/**
 * Banner Section Component
 * Компонент секции баннера
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { BannerComponent } from '@components/atoms/banner.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BannerSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Banner Section');
  }

  // ========== ЛОКАТОРЫ ==========

  get banner(): Locator {
    return this.root.locator('.banner, .hero, .promo');
  }

  get title(): Locator {
    return this.root.locator('h1, .banner-title, .hero-title');
  }

  get subtitle(): Locator {
    return this.root.locator('p, .banner-subtitle, .hero-subtitle');
  }

  get image(): Locator {
    return this.root.locator('img');
  }

  get button(): Locator {
    return this.root.locator('button, .banner-button, .cta-button');
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
   * Получить баннер по индексу
   */
  getBannerByIndex(index: number): BannerComponent {
    const banner = this.banner.nth(index);
    return new BannerComponent(this.page, banner);
  }

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
    logger.step('Hovering over banner section');
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
   * Получить количество баннеров
   */
  async getBannersCount(): Promise<number> {
    try {
      return await this.banner.count();
    } catch {
      return 0;
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
    bannersCount: number;
  }> {
    const [title, subtitle, imageSrc, buttonText, bannersCount] = await Promise.all([
      this.getTitle(),
      this.getSubtitle(),
      this.getImageSrc(),
      this.getButtonText(),
      this.getBannersCount()
    ]);

    return { title, subtitle, imageSrc, buttonText, bannersCount };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли секция баннера
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

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
