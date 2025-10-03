import { Page, Locator, expect } from '@playwright/test';
import { BasePageObject } from '../base/base-page-object';

/**
 * Элементы главной страницы (body)
 */
export enum MainPageBodyItem {
  // Main container
  MainPageBody = 'main.page_content',

  // Banner section
  BannerSection = '.banner-section',
  BannerContainer = '.banner-container',
  BannerImage = '.banner-container img',
  BannerOverlay = '.banner-overlay',
  BannerContent = '.banner-content',
  BannerTitle = '.banner-content h1',
  BannerSubtitle = '.banner-content p',
  BannerButton = '.banner-content button',

  // Games section
  GamesSection = '.games-section',
  GamesSectionTitle = '.games-section h2',
  GamesGrid = '.games-grid',
  GameCard = '.game-card',
  GameCardImage = '.game-card img',
  GameCardTitle = '.game-card .game-title',
  GameCardProvider = '.game-card .game-provider',
  GameCardPlayButton = '.game-card .play-button',
  GameCardFavoriteButton = '.game-card .favorite-button',
  GameCardDemoButton = '.game-card .demo-button',

  // Filters section
  FiltersSection = '.filters-section',
  FilterButton = '.filters-section button',
  FilterButtonActive = '.filters-section button.active',
  FilterDropdown = '.filters-section select',
  SearchInput = '.filters-section input[type="search"]',
  SearchButton = '.filters-section button[type="submit"]',

  // Providers section
  ProvidersSection = '.providers-section',
  ProvidersSectionTitle = '.providers-section h2',
  ProvidersGrid = '.providers-grid',
  ProviderCard = '.provider-card',
  ProviderCardImage = '.provider-card img',
  ProviderCardName = '.provider-card .provider-name',

  // Pagination
  PaginationSection = '.pagination-section',
  PaginationButton = '.pagination-section button',
  PaginationButtonActive = '.pagination-section button.active',
  PaginationPrev = '.pagination-section button.prev',
  PaginationNext = '.pagination-section button.next',
  PaginationFirst = '.pagination-section button.first',
  PaginationLast = '.pagination-section button.last',

  // Loading state
  LoadingSpinner = '.loading-spinner',
  LoadingOverlay = '.loading-overlay',

  // Empty state
  EmptyState = '.empty-state',
  EmptyStateImage = '.empty-state img',
  EmptyStateTitle = '.empty-state h3',
  EmptyStateDescription = '.empty-state p',

  // Error state
  ErrorState = '.error-state',
  ErrorStateTitle = '.error-state h3',
  ErrorStateDescription = '.error-state p',
  ErrorStateRetryButton = '.error-state button.retry',
}

/**
 * Page Object для главной страницы (body)
 */
export class MainPageBodyPage extends BasePageObject {
  constructor(page: Page) {
    super(page);
  }

  protected getMainPageBodySelector(): string {
    return MainPageBodyItem.MainPageBody;
  }

  // ============================================================
  // Проверки загрузки и видимости
  // ============================================================

  async isLoaded(): Promise<boolean> {
    return await this.page.locator(this.getMainPageBodySelector()).isVisible();
  }

  async waitForLoad(): Promise<void> {
    await expect(this.page.locator(this.getMainPageBodySelector())).toBeVisible({ timeout: 10000 });
  }

  async waitForGamesLoad(): Promise<void> {
    await expect(this.page.locator(MainPageBodyItem.GamesGrid)).toBeVisible({ timeout: 10000 });
    // Wait for at least one game card to be visible
    await expect(this.page.locator(MainPageBodyItem.GameCard).first()).toBeVisible({ timeout: 10000 });
  }

  // ============================================================
  // Группы методов
  // ============================================================

  banner = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.BannerSection).isVisible();
    },
    getTitle: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.BannerTitle).innerText();
    },
    getSubtitle: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.BannerSubtitle).innerText();
    },
    clickButton: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.BannerButton).click();
    },
    getImageSrc: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.BannerImage).getAttribute('src') || '';
    },
  };

  games = {
    getCount: async (): Promise<number> => {
      return await this.page.locator(MainPageBodyItem.GameCard).count();
    },
    getGameByIndex: async (index: number): Promise<Locator> => {
      return this.page.locator(MainPageBodyItem.GameCard).nth(index);
    },
    getGameByTitle: async (title: string): Promise<Locator> => {
      return this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title });
    },
    clickGame: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).nth(index).click();
    },
    clickGameByTitle: async (title: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title }).click();
    },
    playGame: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).nth(index).locator(MainPageBodyItem.GameCardPlayButton).click();
    },
    playGameByTitle: async (title: string): Promise<void> => {
      const gameCard = this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title });
      await gameCard.locator(MainPageBodyItem.GameCardPlayButton).click();
    },
    toggleFavorite: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).nth(index).locator(MainPageBodyItem.GameCardFavoriteButton).click();
    },
    toggleFavoriteByTitle: async (title: string): Promise<void> => {
      const gameCard = this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title });
      await gameCard.locator(MainPageBodyItem.GameCardFavoriteButton).click();
    },
    playDemo: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).nth(index).locator(MainPageBodyItem.GameCardDemoButton).click();
    },
    playDemoByTitle: async (title: string): Promise<void> => {
      const gameCard = this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title });
      await gameCard.locator(MainPageBodyItem.GameCardDemoButton).click();
    },
    getGameTitle: async (index: number): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.GameCard).nth(index).locator(MainPageBodyItem.GameCardTitle).innerText();
    },
    getGameProvider: async (index: number): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.GameCard).nth(index).locator(MainPageBodyItem.GameCardProvider).innerText();
    },
    getAllGameTitles: async (): Promise<string[]> => {
      const titles: string[] = [];
      const count = await this.games.getCount();
      for (let i = 0; i < count; i++) {
        titles.push(await this.games.getGameTitle(i));
      }
      return titles;
    },
    hoverGame: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).nth(index).hover();
    },
    hoverGameByTitle: async (title: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.GameCard).filter({ hasText: title }).hover();
    },
  };

  filters = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.FiltersSection).isVisible();
    },
    clickFilter: async (filterText: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.FilterButton).filter({ hasText: filterText }).click();
      await this.page.waitForTimeout(500); // Wait for games to reload
    },
    getActiveFilter: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.FilterButtonActive).innerText();
    },
    getAllFilters: async (): Promise<string[]> => {
      return await this.page.locator(MainPageBodyItem.FilterButton).allInnerTexts();
    },
    selectDropdownFilter: async (value: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.FilterDropdown).selectOption(value);
      await this.page.waitForTimeout(500); // Wait for games to reload
    },
    search: async (query: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.SearchInput).fill(query);
      await this.page.locator(MainPageBodyItem.SearchButton).click();
      await this.page.waitForTimeout(500); // Wait for search results
    },
    clearSearch: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.SearchInput).clear();
    },
    getSearchQuery: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.SearchInput).inputValue();
    },
  };

  providers = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.ProvidersSection).isVisible();
    },
    getCount: async (): Promise<number> => {
      return await this.page.locator(MainPageBodyItem.ProviderCard).count();
    },
    clickProvider: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.ProviderCard).nth(index).click();
      await this.page.waitForTimeout(500); // Wait for games to reload
    },
    clickProviderByName: async (name: string): Promise<void> => {
      await this.page.locator(MainPageBodyItem.ProviderCard).filter({ hasText: name }).click();
      await this.page.waitForTimeout(500); // Wait for games to reload
    },
    getProviderName: async (index: number): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.ProviderCard).nth(index).locator(MainPageBodyItem.ProviderCardName).innerText();
    },
    getAllProviderNames: async (): Promise<string[]> => {
      return await this.page.locator(MainPageBodyItem.ProviderCardName).allInnerTexts();
    },
    hoverProvider: async (index: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.ProviderCard).nth(index).hover();
    },
  };

  pagination = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.PaginationSection).isVisible();
    },
    clickNext: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.PaginationNext).click();
      await this.page.waitForTimeout(500); // Wait for page to load
    },
    clickPrev: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.PaginationPrev).click();
      await this.page.waitForTimeout(500); // Wait for page to load
    },
    clickFirst: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.PaginationFirst).click();
      await this.page.waitForTimeout(500); // Wait for page to load
    },
    clickLast: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.PaginationLast).click();
      await this.page.waitForTimeout(500); // Wait for page to load
    },
    clickPage: async (pageNumber: number): Promise<void> => {
      await this.page.locator(MainPageBodyItem.PaginationButton).filter({ hasText: pageNumber.toString() }).click();
      await this.page.waitForTimeout(500); // Wait for page to load
    },
    getActivePage: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.PaginationButtonActive).innerText();
    },
    getTotalPages: async (): Promise<number> => {
      return await this.page.locator(MainPageBodyItem.PaginationButton).count();
    },
    isNextDisabled: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.PaginationNext).isDisabled();
    },
    isPrevDisabled: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.PaginationPrev).isDisabled();
    },
  };

  loading = {
    isLoading: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.LoadingSpinner).isVisible();
    },
    waitForLoadingComplete: async (): Promise<void> => {
      await expect(this.page.locator(MainPageBodyItem.LoadingSpinner)).toBeHidden({ timeout: 10000 });
    },
    isOverlayVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.LoadingOverlay).isVisible();
    },
  };

  emptyState = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.EmptyState).isVisible();
    },
    getTitle: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.EmptyStateTitle).innerText();
    },
    getDescription: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.EmptyStateDescription).innerText();
    },
  };

  errorState = {
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(MainPageBodyItem.ErrorState).isVisible();
    },
    getTitle: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.ErrorStateTitle).innerText();
    },
    getDescription: async (): Promise<string> => {
      return await this.page.locator(MainPageBodyItem.ErrorStateDescription).innerText();
    },
    clickRetry: async (): Promise<void> => {
      await this.page.locator(MainPageBodyItem.ErrorStateRetryButton).click();
      await this.page.waitForTimeout(500); // Wait for retry to complete
    },
  };

  // ============================================================
  // Комплексные действия
  // ============================================================

  /**
   * Найти и запустить игру по названию
   */
  async findAndPlayGame(title: string): Promise<void> {
    await this.filters.search(title);
    await this.loading.waitForLoadingComplete();
    await this.games.playGameByTitle(title);
  }

  /**
   * Отфильтровать игры по провайдеру
   */
  async filterByProvider(providerName: string): Promise<void> {
    await this.providers.clickProviderByName(providerName);
    await this.loading.waitForLoadingComplete();
  }

  /**
   * Получить все игры на текущей странице
   */
  async getAllGamesOnPage(): Promise<Array<{ title: string; provider: string }>> {
    const games: Array<{ title: string; provider: string }> = [];
    const count = await this.games.getCount();
    for (let i = 0; i < count; i++) {
      games.push({
        title: await this.games.getGameTitle(i),
        provider: await this.games.getGameProvider(i),
      });
    }
    return games;
  }

  /**
   * Проверить, что игры загружены
   */
  async expectGamesLoaded(): Promise<void> {
    await expect(this.page.locator(MainPageBodyItem.GamesGrid)).toBeVisible();
    await expect(this.page.locator(MainPageBodyItem.GameCard).first()).toBeVisible();
  }

  /**
   * Проверить, что пагинация доступна
   */
  async expectPaginationVisible(): Promise<void> {
    await expect(this.page.locator(MainPageBodyItem.PaginationSection)).toBeVisible();
  }
}

