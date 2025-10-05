/**
 * Provider Card Atom
 * Атомарный компонент для карточки провайдера
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';

export class ProviderCardComponent extends BaseComponent {
  constructor(page: Page, providerCard: Locator) {
    super(page, providerCard, 'Provider Card');
  }

  // ========== ЛОКАТОРЫ ==========

  get name(): Locator {
    return this.root.locator('.provider-name, .provider-title, .name');
  }

  get image(): Locator {
    return this.root.locator('img');
  }

  get gamesCount(): Locator {
    return this.root.locator('.games-count, .count, .number');
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
      return await this.root.isVisible() && await this.name.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: 5000 });
    await this.name.waitFor({ state: 'visible', timeout: 3000 });
    logger.success('Provider card component loaded');
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на карточку провайдера
   */
  async click(): Promise<void> {
    logger.step('Clicking provider card');
    await this.root.scrollIntoViewIfNeeded();
    await this.root.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на карточку
   */
  async hover(): Promise<void> {
    logger.step('Hovering over provider card');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить название провайдера
   */
  async getName(): Promise<string | null> {
    try {
      return await this.name.textContent();
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
   * Получить количество игр
   */
  async getGamesCount(): Promise<string | null> {
    try {
      return await this.gamesCount.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить полную информацию о провайдере
   */
  async getProviderInfo(): Promise<{ name: string | null; imageSrc: string | null; gamesCount: string | null }> {
    const [name, imageSrc, gamesCount] = await Promise.all([
      this.getName(),
      this.getImageSrc(),
      this.getGamesCount()
    ]);

    return { name, imageSrc, gamesCount };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========
}
