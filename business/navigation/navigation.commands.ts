import { Page, expect } from '@playwright/test';
import { Routes } from '../../config/routes';

/**
 * Команды навигации (бизнес-логика)
 * Объединяют несколько UI действий в сценарии
 */
export class NavigationCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any
  ) {}

  /**
   * Перейти на страницу и проверить основные компоненты
   */
  async gotoAndVerify(route: string): Promise<void> {
    await this.page.goto(route);
    await this.page.waitForLoadState('domcontentloaded');
    
    await this.verifyMainComponents();
  }

  /**
   * Проверить основные компоненты на странице
   */
  async verifyMainComponents(): Promise<void> {
    const header = this.pageFactory.createHeader();
    const sidebar = this.pageFactory.createSidebar();
    const footer = this.pageFactory.createFooter();

    // Проверяем header
    await expect(async () => {
      const isHeaderLoaded = await header.isLoaded();
      expect(isHeaderLoaded).toBeTruthy();
    }).toPass({ timeout: 10000 });

    // Проверяем sidebar
    await expect(async () => {
      const isSidebarLoaded = await sidebar.isLoaded();
      expect(isSidebarLoaded).toBeTruthy();
    }).toPass({ timeout: 10000 });

    // Проверяем footer
    await expect(async () => {
      const isFooterLoaded = await footer.isLoaded();
      expect(isFooterLoaded).toBeTruthy();
    }).toPass({ timeout: 10000 });
  }

  /**
   * Проверить все основные страницы
   */
  async verifyAllMainPages(): Promise<void> {
    const routes = [Routes.HOME, Routes.SLOTS, Routes.BONUSES];
    
    for (const route of routes) {
      await this.gotoAndVerify(route);
    }
  }

  /**
   * Навигация через sidebar
   */
  async navigateViaSidebar(section: 'slots' | 'popular' | 'new' | 'bonuses'): Promise<void> {
    const sidebar = this.pageFactory.createSidebar();
    
    switch (section) {
      case 'slots':
        await sidebar.games.clickOnSlots();
        await expect(this.page).toHaveURL(new RegExp(Routes.SLOTS));
        break;
      case 'popular':
        await sidebar.games.clickOnPopular();
        await expect(this.page).toHaveURL(new RegExp(Routes.POPULAR));
        break;
      case 'new':
        await sidebar.games.clickOnNew();
        await expect(this.page).toHaveURL(new RegExp(Routes.NEW));
        break;
      case 'bonuses':
        await sidebar.bonuses.clickOnBonuses();
        await expect(this.page).toHaveURL(new RegExp(Routes.BONUSES));
        break;
    }
  }

  /**
   * Переключение языка через header
   */
  async changeLanguage(): Promise<void> {
    const header = this.pageFactory.createHeader();
    
    await header.clickLanguage();
    await expect(header.isLanguageButtonVisible()).resolves.toBeTruthy();
  }

  /**
   * Переход на главную через логотип
   */
  async goHomeViaLogo(): Promise<void> {
    const header = this.pageFactory.createHeader();
    
    // Сначала переходим на другую страницу
    await this.page.goto(Routes.SLOTS);
    
    // Затем кликаем на логотип
    await header.clickLogo();
    await expect(this.page).toHaveURL(Routes.HOME);
  }
}
