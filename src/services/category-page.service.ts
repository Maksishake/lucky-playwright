/**
 * Category Page Service
 * Бизнес-логика для работы с категориями игр
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { CategoryPage } from '@pages/category/category.page';
import { logger } from '@utils/logger.util';

export class CategoryPageService extends BaseService {
  private categoryPage: CategoryPage;

  constructor(page: Page) {
    super(page);
    this.categoryPage = new CategoryPage(page);
  }

  /**
   * Загрузить страницу категории
   */
  async loadCategoryPage(categoryName?: string): Promise<void> {
    this.logStep('Loading category page', categoryName);
    const url = categoryName ? `/category/${categoryName}` : '/';
    await this.page.goto(url);
    await this.categoryPage.waitForLoad();
    this.logSuccess('Category page loaded');
  }

  /**
   * Проверить, загружены ли игры
   */
  async areGamesLoaded(): Promise<boolean> {
    return await this.categoryPage.areGamesLoaded();
  }

  /**
   * Получить количество игр
   */
  async getGamesCount(): Promise<number> {
    const gamesSection = this.categoryPage.gamesSection;
    return await gamesSection.getGamesCount();
  }

  /**
   * Получить информацию об играх
   */
  async getGamesInfo(): Promise<Array<{ title: string | null; provider: string | null; index: number }>> {
    const gamesSection = this.categoryPage.gamesSection;
    return await gamesSection.getAllGamesInfo();
  }

  /**
   * Открыть случайные игры
   */
  async openRandomGames(count: number = 3): Promise<void> {
    this.logStep('Opening random games', count.toString());
    const gamesSection = this.categoryPage.gamesSection;
    await gamesSection.openRandomGames(count);
    this.logSuccess(`Opened ${count} random games`);
  }

  /**
   * Поиск игр
   */
  async searchGames(query: string): Promise<void> {
    this.logStep('Searching games', query);
    const filtersSection = this.categoryPage.filtersSection;
    await filtersSection.search(query);
    await this.waitForNetworkIdle();
    this.logSuccess(`Searched for: ${query}`);
  }

  /**
   * Фильтрация по провайдеру
   */
  async filterByProvider(providerName: string): Promise<void> {
    this.logStep('Filtering by provider', providerName);
    const providersSection = this.categoryPage.providersSection;
    await providersSection.clickProviderByName(providerName);
    await this.waitForNetworkIdle();
    this.logSuccess(`Filtered by provider: ${providerName}`);
  }

  /**
   * Фильтрация по категории
   */
  async filterByCategory(categoryName: string): Promise<void> {
    this.logStep('Filtering by category', categoryName);
    const filtersSection = this.categoryPage.filtersSection;
    await filtersSection.clickFilter(categoryName);
    await this.waitForNetworkIdle();
    this.logSuccess(`Filtered by category: ${categoryName}`);
  }

  /**
   * Навигация по страницам
   */
  async goToNextPage(): Promise<void> {
    this.logStep('Going to next page');
    const paginationSection = this.categoryPage.paginationSection;
    await paginationSection.clickNext();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to next page');
  }

  /**
   * Навигация по страницам
   */
  async goToPrevPage(): Promise<void> {
    this.logStep('Going to previous page');
    const paginationSection = this.categoryPage.paginationSection;
    await paginationSection.clickPrev();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to previous page');
  }

  /**
   * Перейти на конкретную страницу
   */
  async goToPage(pageNumber: number): Promise<void> {
    this.logStep('Going to page', pageNumber.toString());
    const paginationSection = this.categoryPage.paginationSection;
    await paginationSection.clickPage(pageNumber);
    await this.waitForNetworkIdle();
    this.logSuccess(`Navigated to page ${pageNumber}`);
  }

  /**
   * Получить информацию о пагинации
   */
  async getPaginationInfo(): Promise<{
    totalPages: number;
    activePage: string | null;
    activePageNumber: number | null;
    allPageNumbers: number[];
  }> {
    const paginationSection = this.categoryPage.paginationSection;
    return await paginationSection.getPaginationInfo();
  }

  /**
   * Проверить состояние страницы
   */
  async getPageState(): Promise<{
    isLoaded: boolean;
    isLoading: boolean;
    isEmpty: boolean;
    hasError: boolean;
    hasPagination: boolean;
  }> {
    const [isLoaded, isLoading, isEmpty, hasError, hasPagination] = await Promise.all([
      this.categoryPage.isLoaded(),
      this.categoryPage.isLoading(),
      this.categoryPage.isEmpty(),
      this.categoryPage.hasError(),
      this.categoryPage.hasPagination()
    ]);

    return { isLoaded, isLoading, isEmpty, hasError, hasPagination };
  }

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    await this.categoryPage.waitForGamesLoad();
    this.logSuccess('Games loaded');
  }

  /**
   * Дождаться завершения загрузки
   */
  async waitForLoadingComplete(): Promise<void> {
    this.logStep('Waiting for loading to complete');
    await this.categoryPage.waitForLoadingComplete();
    this.logSuccess('Loading completed');
  }
}