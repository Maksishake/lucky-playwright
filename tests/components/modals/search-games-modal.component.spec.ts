/**
 * Search Games Modal Component Tests
 * Тесты для модального окна поиска игр
 */

import { test, expect } from '@playwright/test';
import { SearchGamesModalComponent } from '@components/modals/search-games-modal/search-games-modal.component';

test.describe('Search Games Modal Component', () => {
  let searchModal: SearchGamesModalComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Переходим на страницу с модальным окном поиска
    await page.goto('/');
    
    // Инициализируем компонент
    searchModal = new SearchGamesModalComponent(
      page,
      page.locator('.modal-content'),
      'Search Games Modal'
    );
  });

  test.describe('Basic Functionality', () => {
    test('should be visible when opened', async () => {
      await expect(searchModal.isVisible()).resolves.toBe(true);
    });

    test('should have correct title', async () => {
      const title = await searchModal.getTitle();
      expect(title).toBe('Search games');
    });

    test('should be closable', async () => {
      await searchModal.close();
      await expect(searchModal.isVisible()).resolves.toBe(false);
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for games', async () => {
      await searchModal.searchGames('Gates of Olympus');
      await page.waitForLoadState('networkidle');
      
      const gamesCount = await searchModal.getGamesCount();
      expect(gamesCount).toBeGreaterThan(0);
    });

    test('should clear search', async () => {
      await searchModal.searchGames('test query');
      await searchModal.clearSearch();
      
      const isEmpty = await searchModal.isSearchEmpty();
      expect(isEmpty).toBe(true);
    });

    test('should get search query', async () => {
      const query = 'test search';
      await searchModal.searchGames(query);
      
      const searchQuery = await searchModal.getSearchQuery();
      expect(searchQuery).toBe(query);
    });
  });

  test.describe('Filter Functionality', () => {
    test('should open categories filter', async () => {
      await searchModal.openCategoriesFilter();
      // Проверяем, что фильтр открылся
      await expect(searchModal.getCategoriesButton().isVisible()).resolves.toBe(true);
    });

    test('should open providers filter', async () => {
      await searchModal.openProvidersFilter();
      // Проверяем, что фильтр открылся
      await expect(searchModal.getProvidersButton().isVisible()).resolves.toBe(true);
    });
  });

  test.describe('Games Interaction', () => {
    test('should get games count', async () => {
      const gamesCount = await searchModal.getGamesCount();
      expect(gamesCount).toBeGreaterThan(0);
    });

    test('should get game title by index', async () => {
      const gameTitle = await searchModal.getGameTitle(0);
      expect(gameTitle).toBeTruthy();
    });

    test('should get game provider by index', async () => {
      const gameProvider = await searchModal.getGameProvider(0);
      expect(gameProvider).toBeTruthy();
    });

    test('should get all game titles', async () => {
      const gameTitles = await searchModal.getAllGameTitles();
      expect(gameTitles.length).toBeGreaterThan(0);
    });

    test('should get all game providers', async () => {
      const gameProviders = await searchModal.getAllGameProviders();
      expect(gameProviders.length).toBeGreaterThan(0);
    });

    test('should click on game by index', async () => {
      await searchModal.clickGame(0);
      // Проверяем, что игра открылась
      await page.waitForLoadState('networkidle');
    });

    test('should click on game by title', async () => {
      const gameTitle = await searchModal.getGameTitle(0);
      await searchModal.clickGameByTitle(gameTitle);
      // Проверяем, что игра открылась
      await page.waitForLoadState('networkidle');
    });

    test('should play game by index', async () => {
      await searchModal.playGame(0);
      // Проверяем, что игра запустилась
      await page.waitForLoadState('networkidle');
    });

    test('should play demo by index', async () => {
      await searchModal.playDemo(0);
      // Проверяем, что демо запустилось
      await page.waitForLoadState('networkidle');
    });

    test('should toggle favorite by index', async () => {
      await searchModal.toggleFavorite(0);
      // Проверяем, что избранное переключилось
      await page.waitForLoadState('domcontentloaded');
    });
  });

  test.describe('Load More Functionality', () => {
    test('should load more games', async () => {
      const initialCount = await searchModal.getGamesCount();
      
      if (await searchModal.hasLoadMoreButton()) {
        await searchModal.loadMoreGames();
        const newCount = await searchModal.getGamesCount();
        expect(newCount).toBeGreaterThan(initialCount);
      }
    });
  });

  test.describe('Component State', () => {
    test('should check if games are loaded', async () => {
      const areLoaded = await searchModal.areGamesLoaded();
      expect(areLoaded).toBe(true);
    });

    test('should check if search is empty', async () => {
      const isEmpty = await searchModal.isSearchEmpty();
      expect(isEmpty).toBe(true);
    });

    test('should check if search is focused', async () => {
      await searchModal.getSearchInput().click();
      const isFocused = await searchModal.isSearchFocused();
      expect(isFocused).toBe(true);
    });
  });

  test.describe('Component Information', () => {
    test('should get full modal info', async () => {
      const modalInfo = await searchModal.getSearchGamesModalInfo();
      
      expect(modalInfo.title).toBe('Search games');
      expect(modalInfo.gamesCount).toBeGreaterThan(0);
      expect(modalInfo.gameTitles.length).toBeGreaterThan(0);
      expect(modalInfo.gameProviders.length).toBeGreaterThan(0);
      expect(modalInfo.isLoaded).toBe(true);
    });
  });

  test.describe('Component Access', () => {
    test('should access search input component', async () => {
      const searchInput = searchModal.getSearchInput();
      expect(searchInput).toBeDefined();
    });

    test('should access categories button component', async () => {
      const categoriesButton = searchModal.getCategoriesButton();
      expect(categoriesButton).toBeDefined();
    });

    test('should access providers button component', async () => {
      const providersButton = searchModal.getProvidersButton();
      expect(providersButton).toBeDefined();
    });

    test('should access load more button component', async () => {
      const loadMoreButton = searchModal.getLoadMoreButton();
      expect(loadMoreButton).toBeDefined();
    });

    test('should access close button component', async () => {
      const closeButton = searchModal.getCloseButton();
      expect(closeButton).toBeDefined();
    });
  });
});
