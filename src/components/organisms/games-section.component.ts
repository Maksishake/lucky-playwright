/**
 * Games Section Component
 * Секция игр
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { GameCardComponent } from '@components/atoms/game-card.component';
import { logger } from '@utils/logger.util';

export class GamesSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Games Section');
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
      return await this.root.isVisible() && await this.gamesGrid.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: 5000 });
    await this.gamesGrid.waitFor({ state: 'visible', timeout: 3000 });
    logger.success('Games section component loaded');
  }

  // ========== ЛОКАТОРЫ ==========

  get gamesGrid(): Locator {
    return this.root.locator('.games-grid, .games-list, .games-container');
  }

  get gameCard(): Locator {
    return this.root.locator('.game-card, .slot-card, .game-item');
  }

  get loadingSpinner(): Locator {
    return this.root.locator('.loading-spinner, .spinner, .loader');
  }

  get emptyState(): Locator {
    return this.root.locator('.empty-state, .no-games, .empty');
  }

  get errorState(): Locator {
    return this.root.locator('.error-state, .error, .failed');
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Получить карточку игры по индексу
   */
  getGameByIndex(index: number): GameCardComponent {
    const gameCard = this.gameCard.nth(index);
    return new GameCardComponent(this.page, gameCard);
  }

  /**
   * Получить карточку игры по названию
   */
  getGameByTitle(title: string): GameCardComponent {
    const gameCard = this.gameCard.filter({ hasText: title }).first();
    return new GameCardComponent(this.page, gameCard);
  }

  /**
   * Кликнуть на игру по индексу
   */
  async clickGame(index: number): Promise<void> {
    logger.step(`Clicking game at index ${index}`);
    const game = this.getGameByIndex(index);
    await game.click();
  }

  /**
   * Кликнуть на игру по названию
   */
  async clickGameByTitle(title: string): Promise<void> {
    logger.step(`Clicking game: ${title}`);
    const game = this.getGameByTitle(title);
    await game.click();
  }

  /**
   * Запустить игру по индексу
   */
  async playGame(index: number): Promise<void> {
    logger.step(`Playing game at index ${index}`);
    const game = this.getGameByIndex(index);
    await game.play();
  }

  /**
   * Запустить игру по названию
   */
  async playGameByTitle(title: string): Promise<void> {
    logger.step(`Playing game: ${title}`);
    const game = this.getGameByTitle(title);
    await game.play();
  }

  /**
   * Запустить демо игры по индексу
   */
  async playDemo(index: number): Promise<void> {
    logger.step(`Playing demo at index ${index}`);
    const game = this.getGameByIndex(index);
    await game.playDemo();
  }

  /**
   * Переключить избранное для игры по индексу
   */
  async toggleFavorite(index: number): Promise<void> {
    logger.step(`Toggling favorite for game at index ${index}`);
    const game = this.getGameByIndex(index);
    await game.toggleFavorite();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить количество игр
   */
  async getGamesCount(): Promise<number> {
    try {
      return await this.gameCard.count();
    } catch {
      return 0;
    }
  }

  /**
   * Получить название игры по индексу
   */
  async getGameTitle(index: number): Promise<string | null> {
    try {
      const game = this.getGameByIndex(index);
      return await game.getTitle();
    } catch {
      return null;
    }
  }

  /**
   * Получить провайдера игры по индексу
   */
  async getGameProvider(index: number): Promise<string | null> {
    try {
      const game = this.getGameByIndex(index);
      return await game.getProvider();
    } catch {
      return null;
    }
  }

  /**
   * Получить все названия игр
   */
  async getAllGameTitles(): Promise<string[]> {
    try {
      const count = await this.getGamesCount();
      const titles: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const title = await this.getGameTitle(i);
        if (title) titles.push(title);
      }
      
      return titles;
    } catch {
      return [];
    }
  }

  /**
   * Получить всех провайдеров игр
   */
  async getAllGameProviders(): Promise<string[]> {
    try {
      const count = await this.getGamesCount();
      const providers: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const provider = await this.getGameProvider(i);
        if (provider) providers.push(provider);
      }
      
      return providers;
    } catch {
      return [];
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, загружены ли игры
   */
  async areGamesLoaded(): Promise<boolean> {
    try {
      const count = await this.getGamesCount();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, идет ли загрузка
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingSpinner.isVisible().catch(() => false);
  }

  /**
   * Проверить, пустое ли состояние
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли ошибка
   */
  async hasError(): Promise<boolean> {
    return await this.errorState.isVisible().catch(() => false);
  }

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    logger.step('Waiting for games to load');
    await this.root.waitFor({ state: 'visible' });
    
    // Ждем исчезновения спиннера загрузки
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      logger.warning('Loading spinner timeout - continuing');
    }
  }
}
