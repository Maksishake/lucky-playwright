/**
 * Game Card Atom
 * Атомарный компонент для карточки игры
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class GameCardComponent extends BaseComponent {
  constructor(page: Page, gameCard: Locator) {
    super(page, gameCard, 'Game Card');
  }

  // ========== ЛОКАТОРЫ ==========

  get title(): Locator {
    return this.root.locator('.game-title, .slot-title, .game-name, .title');
  }

  get provider(): Locator {
    return this.root.locator('.game-provider, .slot-provider, .provider, .game-company');
  }

  get image(): Locator {
    return this.root.locator('img');
  }

  get playButton(): Locator {
    return this.root.locator('button:has-text("Play"), button:has-text("Играть"), .play-button, .game-play-btn');
  }

  get favoriteButton(): Locator {
    return this.root.locator('.favorite-button, .favorite-btn, .like-button, .heart-button');
  }

  get demoButton(): Locator {
    return this.root.locator('button:has-text("Demo"), button:has-text("Демо"), .demo-button, .game-demo-btn');
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
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.title.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Game card component loaded');
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на карточку игры
   */
  async click(): Promise<void> {
    logger.step('Clicking game card');
    await this.root.scrollIntoViewIfNeeded();
    await this.root.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Запустить игру (через кнопку Play)
   */
  async play(): Promise<void> {
    logger.step('Playing game');
    const playBtn = this.playButton;
    await playBtn.scrollIntoViewIfNeeded();
    await playBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Запустить демо игры
   */
  async playDemo(): Promise<void> {
    logger.step('Playing demo');
    const demoBtn = this.demoButton;
    await demoBtn.scrollIntoViewIfNeeded();
    await demoBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Добавить/убрать из избранного
   */
  async toggleFavorite(): Promise<void> {
    logger.step('Toggling favorite');
    const favBtn = this.favoriteButton;
    await favBtn.scrollIntoViewIfNeeded();
    await favBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на карточку
   */
  async hover(): Promise<void> {
    logger.step('Hovering over game card');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить название игры
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить провайдера игры
   */
  async getProvider(): Promise<string | null> {
    try {
      return await this.provider.textContent();
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
   * Получить полную информацию об игре
   */
  async getGameInfo(): Promise<{ title: string | null; provider: string | null; imageSrc: string | null }> {
    const [title, provider, imageSrc] = await Promise.all([
      this.getTitle(),
      this.getProvider(),
      this.getImageSrc()
    ]);

    return { title, provider, imageSrc };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, есть ли кнопка Play
   */
  async hasPlayButton(): Promise<boolean> {
    return await this.playButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка избранного
   */
  async hasFavoriteButton(): Promise<boolean> {
    return await this.favoriteButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка демо
   */
  async hasDemoButton(): Promise<boolean> {
    return await this.demoButton.isVisible().catch(() => false);
  }
}
