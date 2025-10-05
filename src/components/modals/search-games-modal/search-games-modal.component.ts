/**
 * Search Games Modal Component
 * Модальное окно поиска игр
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { InputComponent } from '@components/atoms/input/input.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { GameCardComponent } from '@components/atoms/game-card/game-card.component';
import { IconComponent } from '@components/atoms/icon/icon.component';

export class SearchGamesModalComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  private searchInput: InputComponent;
  private categoriesButton: ButtonComponent;
  private providersButton: ButtonComponent;
  private loadMoreButton: ButtonComponent;
  private closeButton: IconComponent;

  constructor(page: Page, root: Locator, componentName: string = 'Search Games Modal') {
    super(page, root, componentName);
    
    // Инициализация компонентов
    this.searchInput = new InputComponent(
      page,
      root.locator('.search-games-input'),
      'Search Games Input'
    );
    
    this.categoriesButton = new ButtonComponent(
      page,
      root.locator('.form-dropdown').first().locator('button'),
      'Categories Button'
    );
    
    this.providersButton = new ButtonComponent(
      page,
      root.locator('.form-dropdown').nth(1).locator('button'),
      'Providers Button'
    );
    
    this.loadMoreButton = new ButtonComponent(
      page,
      root.locator('button:has-text("Завантажити більше")'),
      'Load More Button'
    );
    
    this.closeButton = new IconComponent(
      page,
      root.locator('.modal-close-alpine'),
      'Close Button'
    );
  }

  // ========== ЛОКАТОРЫ ==========

  get modalContent(): Locator {
    return this.root.locator('.modal-content');
  }

  get modalHeader(): Locator {
    return this.root.locator('.modal-header');
  }

  get modalTitle(): Locator {
    return this.root.locator('.modal-title');
  }

  get modalBody(): Locator {
    return this.root.locator('.modal-body');
  }

  get filterContainer(): Locator {
    return this.root.locator('.filter-container-wrapper');
  }

  get searchInputField(): Locator {
    return this.root.locator('.search-games-input');
  }

  get searchIcon(): Locator {
    return this.root.locator('.search-games-input').locator('+ .icon');
  }

  get categoriesDropdown(): Locator {
    return this.root.locator('.form-dropdown').first();
  }

  get providersDropdown(): Locator {
    return this.root.locator('.form-dropdown').nth(1);
  }

  get gamesList(): Locator {
    return this.root.locator('.game-card-list.games');
  }

  get gameCards(): Locator {
    return this.root.locator('.game-card');
  }

  get loadMoreContainer(): Locator {
    return this.root.locator('.flex-row-center');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость модального окна
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку модального окна
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.modalContent.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки модального окна
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
    await this.modalContent.waitFor({ state: 'visible' });
  }

  // ========== ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на модальное окно
   */
  @LogAction('Click search games modal')
  @ValidateState()
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Навести курсор на модальное окно
   */
  @LogAction('Hover search games modal')
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /**
   * Закрыть модальное окно
   */
  @LogAction('Close search games modal')
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Выполнить поиск игр
   */
  @LogAction('Search games')
  @ValidateState()
  async searchGames(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.pressEnter();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Очистить поиск
   */
  @LogAction('Clear search')
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Открыть фильтр категорий
   */
  @LogAction('Open categories filter')
  @ValidateState()
  async openCategoriesFilter(): Promise<void> {
    await this.categoriesButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Открыть фильтр провайдеров
   */
  @LogAction('Open providers filter')
  @ValidateState()
  async openProvidersFilter(): Promise<void> {
    await this.providersButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Загрузить больше игр
   */
  @LogAction('Load more games')
  @ValidateState()
  async loadMoreGames(): Promise<void> {
    await this.loadMoreButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ========== РАБОТА С ИГРАМИ ==========

  /**
   * Получить карточку игры по индексу
   */
  getGameByIndex(index: number): GameCardComponent {
    const gameCard = this.gameCards.nth(index);
    return new GameCardComponent(this.page, gameCard, `Game ${index}`);
  }

  /**
   * Получить карточку игры по названию
   */
  getGameByTitle(title: string): GameCardComponent {
    const gameCard = this.gameCards.filter({ hasText: title }).first();
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

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить текст модального окна
   */
  @LogAction('Get modal text')
  async getText(): Promise<string> {
    try {
      return await this.modalTitle.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить заголовок модального окна
   */
  @LogAction('Get modal title')
  async getTitle(): Promise<string> {
    try {
      return await this.modalTitle.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить текст поискового запроса
   */
  @LogAction('Get search query')
  async getSearchQuery(): Promise<string> {
    return await this.searchInput.getValue();
  }

  /**
   * Получить количество игр
   */
  @LogAction('Get games count')
  async getGamesCount(): Promise<number> {
    try {
      return await this.gameCards.count();
    } catch {
      return 0;
    }
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
    const count = await this.getGamesCount();
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
    const count = await this.getGamesCount();
    const providers: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const provider = await this.getGameProvider(i);
      if (provider) providers.push(provider);
    }
    
    return providers;
  }

  /**
   * Получить атрибут модального окна
   */
  async getAttribute(name: string): Promise<string | null> {
    try {
      return await this.root.getAttribute(name);
    } catch {
      return null;
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить активность модального окна
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность модального окна
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, загружены ли игры
   */
  @LogAction('Check if games are loaded')
  async areGamesLoaded(): Promise<boolean> {
    const count = await this.getGamesCount();
    return count > 0;
  }

  /**
   * Проверить наличие кнопки "Загрузить больше"
   */
  async hasLoadMoreButton(): Promise<boolean> {
    return await this.loadMoreButton.isVisible();
  }

  /**
   * Проверить, пустое ли поле поиска
   */
  async isSearchEmpty(): Promise<boolean> {
    return await this.searchInput.isEmpty();
  }

  /**
   * Проверить, активно ли поле поиска
   */
  async isSearchFocused(): Promise<boolean> {
    return await this.searchInput.isFocused();
  }

  // ========== ПОЛУЧЕНИЕ КОМПОНЕНТОВ ==========

  /**
   * Получить компонент поискового поля
   */
  getSearchInput(): InputComponent {
    return this.searchInput;
  }

  /**
   * Получить компонент кнопки категорий
   */
  getCategoriesButton(): ButtonComponent {
    return this.categoriesButton;
  }

  /**
   * Получить компонент кнопки провайдеров
   */
  getProvidersButton(): ButtonComponent {
    return this.providersButton;
  }

  /**
   * Получить компонент кнопки загрузки
   */
  getLoadMoreButton(): ButtonComponent {
    return this.loadMoreButton;
  }

  /**
   * Получить компонент кнопки закрытия
   */
  getCloseButton(): IconComponent {
    return this.closeButton;
  }

  // ========== ПОЛУЧЕНИЕ ПОЛНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить полную информацию о модальном окне поиска
   */
  @LogAction('Get search games modal info')
  async getSearchGamesModalInfo(): Promise<{
    title: string;
    searchQuery: string;
    gamesCount: number;
    gameTitles: string[];
    gameProviders: string[];
    isLoaded: boolean;
    hasLoadMoreButton: boolean;
    isSearchEmpty: boolean;
    isSearchFocused: boolean;
  }> {
    const [
      title,
      searchQuery,
      gamesCount,
      gameTitles,
      gameProviders,
      isLoaded,
      hasLoadMoreButton,
      isSearchEmpty,
      isSearchFocused
    ] = await Promise.all([
      this.getTitle(),
      this.getSearchQuery(),
      this.getGamesCount(),
      this.getAllGameTitles(),
      this.getAllGameProviders(),
      this.areGamesLoaded(),
      this.hasLoadMoreButton(),
      this.isSearchEmpty(),
      this.isSearchFocused()
    ]);

    return {
      title,
      searchQuery,
      gamesCount,
      gameTitles,
      gameProviders,
      isLoaded,
      hasLoadMoreButton,
      isSearchEmpty,
      isSearchFocused
    };
  }
}
