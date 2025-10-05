/**
 * Games Section Component - Organism
 * Организм: сложный компонент, содержащий множество GameCard
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../../core/abstract/base.component';
import { IContainerComponent } from '../../../core/interfaces/component.interface';
import { LogAction, ValidateState } from '../../../core/decorators/logger.decorator';
import { GameCardComponent } from '../../atoms/game-card/game-card.component';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';

export class GamesSectionComponent extends BaseComponent implements IContainerComponent {
  private searchBar: SearchBarComponent;

  constructor(page: Page, root: Locator, componentName: string = 'Games Section') {
    super(page, root, componentName);
    
    // Инициализация поисковой панели
    this.searchBar = new SearchBarComponent(
      page,
      root.locator('.search-bar, .search-section, .filters-section'),
      'Search Bar'
    );
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

  get pagination(): Locator {
    return this.root.locator('.pagination, .pagination-controls');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость секции игр
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку секции игр
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки секции игр
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== РАБОТА С ИГРАМИ ==========

  /**
   * Получить карточку игры по индексу
   */
  getGameByIndex(index: number): GameCardComponent {
    const gameCard = this.gameCard.nth(index);
    return new GameCardComponent(this.page, gameCard, `Game ${index}`);
  }

  /**
   * Получить карточку игры по названию
   */
  getGameByTitle(title: string): GameCardComponent {
    const gameCard = this.gameCard.filter({ hasText: title }).first();
    return new GameCardComponent(this.page, gameCard, `Game: ${title}`);
  }

  /**
   * Кликнуть на игру по индексу
   */
  @LogAction('Click game by index')
  @ValidateState()
  async clickGame(index: number): Promise<void> {
    const game = this.getGameByIndex(index);
    await game.click();
  }

  /**
   * Кликнуть на игру по названию
   */
  @LogAction('Click game by title')
  @ValidateState()
  async clickGameByTitle(title: string): Promise<void> {
    const game = this.getGameByTitle(title);
    await game.click();
  }

  /**
   * Запустить игру по индексу
   */
  @LogAction('Play game by index')
  @ValidateState()
  async playGame(index: number): Promise<void> {
    const game = this.getGameByIndex(index);
    await game.play();
  }

  /**
   * Запустить игру по названию
   */
  @LogAction('Play game by title')
  @ValidateState()
  async playGameByTitle(title: string): Promise<void> {
    const game = this.getGameByTitle(title);
    await game.play();
  }

  /**
   * Запустить демо игры по индексу
   */
  @LogAction('Play demo by index')
  @ValidateState()
  async playDemo(index: number): Promise<void> {
    const game = this.getGameByIndex(index);
    await game.playDemo();
  }

  /**
   * Переключить избранное для игры по индексу
   */
  @LogAction('Toggle favorite by index')
  @ValidateState()
  async toggleFavorite(index: number): Promise<void> {
    const game = this.getGameByIndex(index);
    await game.toggleFavorite();
  }

  // ========== ПОИСК И ФИЛЬТРАЦИЯ ==========

  /**
   * Выполнить поиск игр
   */
  @LogAction('Search games')
  @ValidateState()
  async searchGames(query: string): Promise<void> {
    await this.searchBar.search(query);
  }

  /**
   * Очистить поиск
   */
  @LogAction('Clear search')
  async clearSearch(): Promise<void> {
    await this.searchBar.clearSearch();
  }

  /**
   * Применить фильтр
   */
  @LogAction('Apply filter')
  @ValidateState()
  async applyFilter(): Promise<void> {
    await this.searchBar.applyFilter();
  }

  /**
   * Сбросить фильтры
   */
  @LogAction('Reset filters')
  async resetFilters(): Promise<void> {
    await this.searchBar.resetFilters();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить количество игр
   */
  @LogAction('Get games count')
  async getChildCount(): Promise<number> {
    try {
      return await this.gameCard.count();
    } catch {
      return 0;
    }
  }

  /**
   * Получить дочерний элемент по индексу
   */
  getChild(index: number): Locator {
    return this.gameCard.nth(index);
  }

  /**
   * Проверить наличие дочерних элементов
   */
  async hasChildren(): Promise<boolean> {
    const count = await this.getChildCount();
    return count > 0;
  }

  /**
   * Получить название игры по индексу
   */
  @LogAction('Get game title by index')
  async getGameTitle(index: number): Promise<string> {
    const game = this.getGameByIndex(index);
    return await game.getTitle();
  }

  /**
   * Получить провайдера игры по индексу
   */
  @LogAction('Get game provider by index')
  async getGameProvider(index: number): Promise<string> {
    const game = this.getGameByIndex(index);
    return await game.getProvider();
  }

  /**
   * Получить все названия игр
   */
  @LogAction('Get all game titles')
  async getAllGameTitles(): Promise<string[]> {
    const count = await this.getChildCount();
    const titles: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const title = await this.getGameTitle(i);
      if (title) titles.push(title);
    }
    
    return titles;
  }

  /**
   * Получить всех провайдеров игр
   */
  @LogAction('Get all game providers')
  async getAllGameProviders(): Promise<string[]> {
    const count = await this.getChildCount();
    const providers: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const provider = await this.getGameProvider(i);
      if (provider) providers.push(provider);
    }
    
    return providers;
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, загружены ли игры
   */
  @LogAction('Check if games are loaded')
  async areGamesLoaded(): Promise<boolean> {
    const count = await this.getChildCount();
    return count > 0;
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
   * Проверить наличие пагинации
   */
  async hasPagination(): Promise<boolean> {
    return await this.pagination.isVisible().catch(() => false);
  }

  /**
   * Дождаться загрузки игр
   */
  @LogAction('Wait for games to load')
  async waitForGamesLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
    
    // Ждем исчезновения спиннера загрузки
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Игнорируем таймаут спиннера
    }
  }

  // ========== ПОЛУЧЕНИЕ КОМПОНЕНТОВ ==========

  /**
   * Получить компонент поисковой панели
   */
  getSearchBar(): SearchBarComponent {
    return this.searchBar;
  }

  // ========== ПОЛУЧЕНИЕ ПОЛНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить полную информацию о секции игр
   */
  @LogAction('Get games section info')
  async getGamesSectionInfo(): Promise<{
    gamesCount: number;
    gameTitles: string[];
    gameProviders: string[];
    isLoaded: boolean;
    isLoading: boolean;
    isEmpty: boolean;
    hasError: boolean;
    hasPagination: boolean;
    searchQuery: string;
  }> {
    const [
      gamesCount,
      gameTitles,
      gameProviders,
      isLoaded,
      isLoading,
      isEmpty,
      hasError,
      hasPagination,
      searchQuery
    ] = await Promise.all([
      this.getChildCount(),
      this.getAllGameTitles(),
      this.getAllGameProviders(),
      this.areGamesLoaded(),
      this.isLoading(),
      this.isEmpty(),
      this.hasError(),
      this.hasPagination(),
      this.searchBar.getText()
    ]);

    return {
      gamesCount,
      gameTitles,
      gameProviders,
      isLoaded,
      isLoading,
      isEmpty,
      hasError,
      hasPagination,
      searchQuery
    };
  }
}
