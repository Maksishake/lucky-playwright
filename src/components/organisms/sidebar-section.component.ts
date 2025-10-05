import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { Routes } from '@config/routes';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

/**
 * Sidebar Section Component
 * UI-слой для боковой панели навигации
 */
export class SidebarSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Sidebar Section');
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

  // ========== ЛОКАТОРЫ ==========

  get sidebar(): Locator {
    return this.page.locator('sidebar.menu');
  }

  get allGamesButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Усі"), sidebar.menu button:has-text("All"), sidebar.menu .all-games-button');
  }

  get popularButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Popular"), sidebar.menu button:has-text("Популярні"), sidebar.menu .popular-button');
  }

  get newButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("New"), sidebar.menu button:has-text("Нові"), sidebar.menu .new-button');
  }

  get slotsButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Slots"), sidebar.menu button:has-text("Слоти"), sidebar.menu .slots-button');
  }

  get buyBonusButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Buy Bonus"), sidebar.menu button:has-text("Купити бонус"), sidebar.menu .buy-bonus-button');
  }

  get liveCasinoButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Live Casino"), sidebar.menu button:has-text("Лайв казино"), sidebar.menu .live-casino-button');
  }

  get showGamesButton(): Locator {
    return this.page.locator('sidebar.menu button:has-text("Show Games"), sidebar.menu button:has-text("Показати ігри"), sidebar.menu .show-games-button');
  }

  get activeButton(): Locator {
    return this.page.locator('sidebar.menu button.active, sidebar.menu .active-button');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.sidebar.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.sidebar.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== НАВИГАЦИЯ ==========

  /**
   * Перейти к разделу "Усі"
   */
  async goToAll(): Promise<void> {
    logger.step('Navigating to all games');
    await this.allGamesButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to all games');
  }

  /**
   * Перейти к разделу "Popular"
   */
  async goToPopular(): Promise<void> {
    logger.step('Navigating to popular games');
    await this.popularButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to popular games');
  }

  /**
   * Перейти к разделу "New"
   */
  async goToNew(): Promise<void> {
    logger.step('Navigating to new games');
    await this.newButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to new games');
  }

  /**
   * Перейти к разделу "Slots"
   */
  async goToSlots(): Promise<void> {
    logger.step('Navigating to slots');
    await this.slotsButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to slots');
  }

  /**
   * Перейти к разделу "Buy Bonus"
   */
  async goToBuyBonus(): Promise<void> {
    logger.step('Navigating to buy bonus');
    await this.buyBonusButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to buy bonus');
  }

  /**
   * Перейти к разделу "Live Casino"
   */
  async goToLiveCasino(): Promise<void> {
    logger.step('Navigating to live casino');
    await this.liveCasinoButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to live casino');
  }

  /**
   * Перейти к разделу "Show Games"
   */
  async goToShowGames(): Promise<void> {
    logger.step('Navigating to show games');
    await this.showGamesButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Navigated to show games');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить активную кнопку
   */
  async getActiveButton(): Promise<string | null> {
    try {
      return await this.activeButton.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить все доступные кнопки
   */
  async getAllButtons(): Promise<string[]> {
    try {
      const buttons = this.page.locator('sidebar.menu button');
      return await buttons.allTextContents();
    } catch {
      return [];
    }
  }

  /**
   * Получить информацию о сайдбаре
   */
  async getSidebarInfo(): Promise<{
    activeButton: string | null;
    allButtons: string[];
    isVisible: boolean;
  }> {
    const [activeButton, allButtons, isVisible] = await Promise.all([
      this.getActiveButton(),
      this.getAllButtons(),
      this.isSidebarVisible()
    ]);

    return { activeButton, allButtons, isVisible };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли боковая панель
   */
  async isSidebarVisible(): Promise<boolean> {
    return await this.sidebar.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Усі"
   */
  async hasAllGamesButton(): Promise<boolean> {
    return await this.allGamesButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Popular"
   */
  async hasPopularButton(): Promise<boolean> {
    return await this.popularButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "New"
   */
  async hasNewButton(): Promise<boolean> {
    return await this.newButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Slots"
   */
  async hasSlotsButton(): Promise<boolean> {
    return await this.slotsButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Buy Bonus"
   */
  async hasBuyBonusButton(): Promise<boolean> {
    return await this.buyBonusButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Live Casino"
   */
  async hasLiveCasinoButton(): Promise<boolean> {
    return await this.liveCasinoButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Show Games"
   */
  async hasShowGamesButton(): Promise<boolean> {
    return await this.showGamesButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли активная кнопка
   */
  async hasActiveButton(): Promise<boolean> {
    return await this.activeButton.isVisible().catch(() => false);
  }
}
