/**
 * Atomic Architecture Test
 * Демонстрация новой атомарной архитектуры
 */

import { test, expect } from '@playwright/test';
import { AuthService } from '../../../services/auth.service';
import { CategoryPageService } from '../../../services/category-page.service';
import { GamesService } from '../../../services/games.service';
import { FiltersService } from '../../../services/filters.service';
import { PaginationService } from '../../../services/pagination.service';
import { Environment } from '../../../config/environment';
import { logger } from '../../../utils/core/logger';

test.describe('🧪 Atomic Architecture Tests', () => {
  let authService: AuthService;
  let categoryPageService: CategoryPageService;
  let gamesService: GamesService;
  let filtersService: FiltersService;
  let paginationService: PaginationService;

  test.beforeEach(async ({ page }) => {
    authService = new AuthService(page);
    categoryPageService = new CategoryPageService(page);
    gamesService = new GamesService(page);
    filtersService = new FiltersService(page);
    paginationService = new PaginationService(page);
  });

  test('A1: Тест атомарной архитектуры - главная страница @smoke', async ({ page }) => {
    logger.step('Starting atomic architecture test');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live/');
    await page.waitForLoadState('domcontentloaded');
    
    // Авторизуемся
    await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
    await page.waitForLoadState('domcontentloaded');
    
    // Загружаем страницу категории
    await categoryPageService.loadCategoryPage();
    
    // Проверяем состояние страницы
    const pageState = await categoryPageService.getPageState();
    logger.debug(`Page state: ${JSON.stringify(pageState, null, 2)}`);
    
    expect(pageState.isLoaded).toBeTruthy();
    expect(pageState.hasError).toBeFalsy();
    
    // Проверяем игры
    const gamesLoaded = await categoryPageService.areGamesLoaded();
    expect(gamesLoaded).toBeTruthy();
    
    const gamesCount = await categoryPageService.getGamesCount();
    logger.success(`Found ${gamesCount} games`);
    expect(gamesCount).toBeGreaterThan(0);
    
    // Получаем информацию об играх
    const gamesInfo = await categoryPageService.getGamesInfo();
    logger.debug(`First 3 games: ${JSON.stringify(gamesInfo.slice(0, 3), null, 2)}`);
    
    logger.success('Atomic architecture test completed successfully');
  });

  test('A2: Тест атомарных компонентов - игры @smoke', async ({ page }) => {
    logger.step('Testing atomic game components');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live/');
    await page.waitForLoadState('domcontentloaded');
    
    // Авторизуемся
    await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
    await page.waitForLoadState('domcontentloaded');
    
    // Загружаем страницу категории
    await categoryPageService.loadCategoryPage();
    
    // Тестируем GamesService
    const games = await gamesService.getAllGames();
    expect(games.length).toBeGreaterThan(0);
    
    const gameTitles = await gamesService.getAllGameTitles();
    expect(gameTitles.length).toBeGreaterThan(0);
    
    const gameProviders = await gamesService.getAllGameProviders();
    expect(gameProviders.length).toBeGreaterThan(0);
    
    logger.success(`Found ${games.length} games with ${gameTitles.length} titles and ${gameProviders.length} providers`);
    
    // Тестируем открытие случайных игр
    await gamesService.openRandomGames(2);
    
    logger.success('Atomic game components test completed');
  });

  test('A3: Тест атомарных компонентов - фильтры @smoke', async ({ page }) => {
    logger.step('Testing atomic filter components');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live/');
    await page.waitForLoadState('domcontentloaded');
    
    // Авторизуемся
    await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
    await page.waitForLoadState('domcontentloaded');
    
    // Загружаем страницу категории
    await categoryPageService.loadCategoryPage();
    
    // Тестируем FiltersService
    const hasSearchInput = await filtersService.hasSearchInput();
    logger.debug(`Has search input: ${hasSearchInput}`);
    
    if (hasSearchInput) {
      // Тестируем поиск
      await filtersService.search('slot');
      const searchQuery = await filtersService.getSearchQuery();
      expect(searchQuery).toContain('slot');
      
      // Очищаем поиск
      await filtersService.clearSearch();
    }
    
    // Получаем все фильтры
    const allFilters = await filtersService.getAllFilters();
    logger.debug(`Available filters: ${allFilters.join(', ')}`);
    
    // Получаем активный фильтр
    const activeFilter = await filtersService.getActiveFilter();
    logger.debug(`Active filter: ${activeFilter || 'None'}`);
    
    logger.success('Atomic filter components test completed');
  });

  test('A4: Тест атомарных компонентов - пагинация @smoke', async ({ page }) => {
    logger.step('Testing atomic pagination components');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live/');
    await page.waitForLoadState('domcontentloaded');
    
    // Авторизуемся
    await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
    await page.waitForLoadState('domcontentloaded');
    
    // Загружаем страницу категории
    await categoryPageService.loadCategoryPage();
    
    // Тестируем PaginationService
    const hasPagination = await paginationService.hasPagination();
    logger.debug(`Has pagination: ${hasPagination}`);
    
    if (hasPagination) {
      // Получаем информацию о пагинации
      const paginationInfo = await paginationService.getPaginationInfo();
      logger.debug(`Pagination info: ${JSON.stringify(paginationInfo, null, 2)}`);
      
      expect(paginationInfo.totalPages).toBeGreaterThan(0);
      expect(paginationInfo.activePageNumber).toBeGreaterThan(0);
      
      // Проверяем состояние кнопок
      const isPrevDisabled = await paginationService.isPrevDisabled();
      const isNextDisabled = await paginationService.isNextDisabled();
      
      logger.debug(`Prev disabled: ${isPrevDisabled}, Next disabled: ${isNextDisabled}`);
      
      // Если есть следующая страница, переходим на неё
      if (!isNextDisabled && paginationInfo.totalPages > 1) {
        await paginationService.goToNextPage();
        
        // Проверяем, что перешли на следующую страницу
        const newActivePage = await paginationService.getActivePageNumber();
        expect(newActivePage).toBeGreaterThan(paginationInfo.activePageNumber || 0);
        
        // Возвращаемся назад
        await paginationService.goToPrevPage();
      }
    } else {
      logger.info('No pagination found on this page');
    }
    
    logger.success('Atomic pagination components test completed');
  });

  test('A5: Тест комплексной атомарной архитектуры @smoke', async ({ page }) => {
    logger.step('Testing comprehensive atomic architecture');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live/');
    await page.waitForLoadState('domcontentloaded');
    
    // Авторизуемся
    await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
    await page.waitForLoadState('domcontentloaded');
    
    // Загружаем страницу категории
    await categoryPageService.loadCategoryPage();
    
    // Комплексный тест всех сервисов
    const [gamesCount, hasPagination, hasSearchInput] = await Promise.all([
      gamesService.getGamesCount(),
      paginationService.hasPagination(),
      filtersService.hasSearchInput()
    ]);
    
    logger.success(`Comprehensive test results:`);
    logger.success(`- Games: ${gamesCount}`);
    logger.success(`- Pagination: ${hasPagination}`);
    logger.success(`- Search: ${hasSearchInput}`);
    
    // Тестируем поиск, если доступен
    if (hasSearchInput) {
      await filtersService.search('game');
      await page.waitForTimeout(1000); // Ждем результатов поиска
      
      const newGamesCount = await gamesService.getGamesCount();
      logger.debug(`Games after search: ${newGamesCount}`);
    }
    
    // Тестируем пагинацию, если доступна
    if (hasPagination) {
      const paginationInfo = await paginationService.getPaginationInfo();
      if (paginationInfo.totalPages > 1) {
        await paginationService.goToNextPage();
        await page.waitForTimeout(1000); // Ждем загрузки страницы
        
        const newGamesCount = await gamesService.getGamesCount();
        logger.debug(`Games on page 2: ${newGamesCount}`);
      }
    }
    
    logger.success('Comprehensive atomic architecture test completed');
  });
});
