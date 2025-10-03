import { Page, expect } from '@playwright/test';
import { ProviderItem, CategoryItem } from '../../pages/components/filter-category-provider.component';
import { Routes } from '../../config/routes';

/**
 * Команды для работы с играми (бизнес-логика)
 * Объединяют несколько UI действий в сценарии
 */
export class GamesCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any,
    private readonly widgetFactory: any
  ) {}

  /**
   * Тестировать случайные слоты от провайдера
   */
  async testRandomSlotsFromProvider(
    provider: ProviderItem,
    count: number = 3
  ): Promise<string[]> {
    // Переходим на страницу слотов
    await this.page.goto(Routes.SLOTS);
    await this.page.waitForLoadState('domcontentloaded');

    const filterProvider = this.pageFactory.createFilterCategoryProvider();
    const mainBody = this.pageFactory.createMainPageBody();

    // Выбираем провайдера
    await filterProvider.clickProvider(provider);
    await this.page.waitForLoadState('networkidle');

    // Получаем и тестируем игры
    const gamesCount = await mainBody.games.getCount();
    expect(gamesCount).toBeGreaterThan(0);

    const gamesToTest = Math.min(count, gamesCount);
    const testedGames: string[] = [];

    for (let i = 0; i < gamesToTest; i++) {
      const gameTitle = await mainBody.games.getGameTitle(i);
      testedGames.push(gameTitle);

      // Проверяем видимость игры
      await mainBody.games.hoverGame(i);
      const gameCard = await mainBody.games.getGameByIndex(i);
      await expect(gameCard).toBeVisible();
    }

    return testedGames;
  }

  /**
   * Фильтрация игр по категории
   */
  async filterByCategory(category: CategoryItem): Promise<void> {
    const filterProvider = this.pageFactory.createFilterCategoryProvider();
    const mainBody = this.pageFactory.createMainPageBody();

    await filterProvider.clickCategory(category);
    await this.page.waitForLoadState('networkidle');
    
    await mainBody.expectGamesLoaded();
    const gamesCount = await mainBody.games.getCount();
    expect(gamesCount).toBeGreaterThan(0);
  }

  /**
   * Проверить отображение баннеров
   */
  async verifyBanners(): Promise<void> {
    await this.page.goto(Routes.HOME);
    
    const mainBody = this.pageFactory.createMainPageBody();
    await mainBody.waitForLoad();
    
    const isBannerVisible = await mainBody.banner.isVisible();
    expect(isBannerVisible).toBeTruthy();
  }

  /**
   * Получить статистику по фильтрам
   */
  async getFiltersStatistics(): Promise<{
    categories: { total: number; visible: CategoryItem[] };
    providers: { total: number; visible: ProviderItem[] };
  }> {
    await this.page.goto(Routes.SLOTS);
    
    const filterProvider = this.pageFactory.createFilterCategoryProvider();
    return await filterProvider.getFiltersStats();
  }

  /**
   * Поиск игр на странице
   */
  async searchGamesOnPage(): Promise<string[]> {
    await this.page.goto(Routes.HOME);
    
    const mainBody = this.pageFactory.createMainPageBody();
    await mainBody.waitForGamesLoad();
    
    const allGames = await mainBody.games.getAllGameTitles();
    expect(allGames.length).toBeGreaterThan(0);
    
    return allGames;
  }

  /**
   * Полный сценарий: открыть случайную игру
   */
  async openRandomGame(): Promise<string> {
    const games = await this.searchGamesOnPage();
    const randomIndex = Math.floor(Math.random() * Math.min(games.length, 10));
    
    const mainBody = this.pageFactory.createMainPageBody();
    const gameTitle = await mainBody.games.getGameTitle(randomIndex);
    
    // Кликаем на игру
    await mainBody.games.clickGame(randomIndex);
    
    return gameTitle;
  }
}
