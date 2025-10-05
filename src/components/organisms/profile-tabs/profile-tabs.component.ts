/**
 * Profile Tabs Component - Organism
 * Компонент табов профиля пользователя
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class ProfileTabsComponent extends BaseComponent {
  // ========== ЛОКАТОРЫ ==========

  // Навигация табов
  readonly tabNav: Locator;
  readonly tabItems: Locator;

  // Конкретные табы
  readonly overviewTab: Locator;
  readonly detailsTab: Locator;
  readonly securityTab: Locator;
  readonly verificationTab: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Profile Tabs') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.tabNav = root.locator('.tab-nav');
    this.tabItems = root.locator('.tab-item');

    // Инициализация конкретных табов
    this.overviewTab = root.locator('.tab-item:has-text("Огляд")');
    this.detailsTab = root.locator('.tab-item:has-text("Деталі користувача")');
    this.securityTab = root.locator('.tab-item:has-text("Безпека")');
    this.verificationTab = root.locator('.tab-item:has-text("Верифікація")');
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
      const isVisible = await this.isVisible();
      const hasTabNav = await this.tabNav.isVisible();
      const hasTabItems = await this.tabItems.count() > 0;
      
      return isVisible && hasTabNav && hasTabItems;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.tabNav.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент табов профиля загружен');
  }

  // ========== МЕТОДЫ РАБОТЫ С ТАБАМИ ==========

  /**
   * Выбрать таб по названию
   * @param tabName Название таба
   */
  @LogAction('Выбор таба: {tabName}')
  @ValidateState()
  async selectTab(tabName: string): Promise<void> {
    try {
      const tab = this.tabItems.filter({ hasText: tabName });
      await tab.click();
      await tab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
      // Проверяем, что таб стал активным
      const hasActiveClass = await tab.getAttribute('class');
      if (!hasActiveClass?.includes('active')) {
        throw new Error(`Tab "${tabName}" did not become active`);
      }
      await this.page.waitForLoadState('networkidle');
      logger.success(`Таб "${tabName}" выбран`);
    } catch (error) {
      logger.error(`Ошибка выбора таба "${tabName}"`, error as Error);
      throw error;
    }
  }

  /**
   * Переключиться на таб "Огляд"
   */
  @LogAction('Переключение на таб "Огляд"')
  @ValidateState()
  async selectOverviewTab(): Promise<void> {
    await this.overviewTab.click();
    await this.overviewTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.overviewTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Overview tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Огляд" выбран');
  }

  /**
   * Переключиться на таб "Деталі користувача"
   */
  @LogAction('Переключение на таб "Деталі користувача"')
  @ValidateState()
  async selectDetailsTab(): Promise<void> {
    await this.detailsTab.click();
    await this.detailsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.detailsTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Details tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Деталі користувача" выбран');
  }

  /**
   * Переключиться на таб "Безпека"
   */
  @LogAction('Переключение на таб "Безпека"')
  @ValidateState()
  async selectSecurityTab(): Promise<void> {
    await this.securityTab.click();
    await this.securityTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.securityTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Security tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Безпека" выбран');
  }

  /**
   * Переключиться на таб "Верифікація"
   */
  @LogAction('Переключение на таб "Верифікація"')
  @ValidateState()
  async selectVerificationTab(): Promise<void> {
    await this.verificationTab.click();
    await this.verificationTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.verificationTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Verification tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Верифікація" выбран');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить названия всех табов
   */
  @LogAction('Получение названий всех табов')
  @ValidateState()
  async getAllTabNames(): Promise<string[]> {
    try {
      const tabTexts = await this.tabItems.allTextContents();
      const names = tabTexts.map(text => text.trim()).filter(text => text !== '');
      logger.success(`Названия табов: ${names.join(', ')}`);
      return names;
    } catch (error) {
      logger.error('Ошибка получения названий табов', error as Error);
      return [];
    }
  }

  /**
   * Получить название активного таба
   */
  @LogAction('Получение названия активного таба')
  @ValidateState()
  async getActiveTabName(): Promise<string> {
    try {
      // Проверяем каждый таб на наличие класса active
      const allTabs = await this.tabItems.all();
      for (const tab of allTabs) {
        const className = await tab.getAttribute('class');
        if (className?.includes('active')) {
          const tabName = await tab.textContent();
          logger.success(`Активный таб: ${tabName}`);
          return tabName || '';
        }
      }
      logger.warning('Активный таб не найден');
      return '';
    } catch (error) {
      logger.error('Ошибка получения активного таба', error as Error);
      return '';
    }
  }

  /**
   * Получить количество табов
   */
  @LogAction('Получение количества табов')
  async getTabsCount(): Promise<number> {
    try {
      const count = await this.tabItems.count();
      logger.success(`Количество табов: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества табов', error as Error);
      return 0;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, активен ли таб по названию
   * @param tabName Название таба
   */
  @LogAction('Проверка активности таба: {tabName}')
  async isTabActive(tabName: string): Promise<boolean> {
    try {
      const tab = this.tabItems.filter({ hasText: tabName });
      const className = await tab.getAttribute('class');
      const isActive = className?.includes('active') || false;
      logger.success(`Таб "${tabName}" активен: ${isActive}`);
      return isActive;
    } catch (error) {
      logger.error(`Ошибка проверки активности таба "${tabName}"`, error as Error);
      return false;
    }
  }

  /**
   * Проверить, что таб "Огляд" активен
   */
  @LogAction('Проверка активности таба "Огляд"')
  async isOverviewTabActive(): Promise<boolean> {
    return await this.isTabActive('Огляд');
  }

  /**
   * Проверить, что таб "Деталі користувача" активен
   */
  @LogAction('Проверка активности таба "Деталі користувача"')
  async isDetailsTabActive(): Promise<boolean> {
    return await this.isTabActive('Деталі користувача');
  }

  /**
   * Проверить, что таб "Безпека" активен
   */
  @LogAction('Проверка активности таба "Безпека"')
  async isSecurityTabActive(): Promise<boolean> {
    return await this.isTabActive('Безпека');
  }

  /**
   * Проверить, что таб "Верифікація" активен
   */
  @LogAction('Проверка активности таба "Верифікація"')
  async isVerificationTabActive(): Promise<boolean> {
    return await this.isTabActive('Верифікація');
  }

  /**
   * Проверить, что компонент полностью загружен
   */
  @LogAction('Проверка полной загрузки компонента табов')
  async isTabsFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasTabNav = await this.tabNav.isVisible();
      const hasTabItems = await this.getTabsCount() > 0;
      const allTabsVisible = await this.areAllTabsVisible();
      
      return isLoaded && hasTabNav && hasTabItems && allTabsVisible;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все табы видимы
   */
  @LogAction('Проверка видимости всех табов')
  async areAllTabsVisible(): Promise<boolean> {
    try {
      const items = await this.tabItems.all();
      const visibilityChecks = await Promise.all(
        items.map(item => item.isVisible())
      );
      return visibilityChecks.every(isVisible => isVisible);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что таб кликабелен
   * @param tabName Название таба
   */
  @LogAction('Проверка кликабельности таба: {tabName}')
  async isTabClickable(tabName: string): Promise<boolean> {
    try {
      const tab = this.tabItems.filter({ hasText: tabName });
      return await tab.isEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОИСКА ==========

  /**
   * Проверить, содержит ли таб текст
   * @param tabName Название таба
   * @param text Текст для поиска
   */
  @LogAction('Проверка содержания текста в табе: {tabName}, текст: {text}')
  async tabContainsText(tabName: string, text: string): Promise<boolean> {
    try {
      const tab = this.tabItems.filter({ hasText: tabName });
      const tabText = await tab.textContent();
      return tabText?.includes(text) || false;
    } catch {
      return false;
    }
  }

  /**
   * Найти таб по тексту
   * @param text Текст для поиска
   */
  @LogAction('Поиск таба по тексту: {text}')
  async findTabByText(text: string): Promise<string | null> {
    try {
      const tab = this.tabItems.filter({ hasText: text });
      if (await tab.isVisible()) {
        const tabName = await tab.textContent();
        logger.success(`Найден таб: ${tabName}`);
        return tabName;
      }
      return null;
    } catch (error) {
      logger.error(`Ошибка поиска таба по тексту: ${text}`, error as Error);
      return null;
    }
  }

  // ========== МЕТОДЫ НАВИГАЦИИ ==========

  /**
   * Переключиться на следующий таб
   */
  @LogAction('Переключение на следующий таб')
  @ValidateState()
  async selectNextTab(): Promise<void> {
    try {
      // Найдем активный таб
      const allTabs = await this.tabItems.all();
      let activeIndex = -1;
      for (let i = 0; i < allTabs.length; i++) {
        const className = await allTabs[i].getAttribute('class');
        if (className?.includes('active')) {
          activeIndex = i;
          break;
        }
      }
      
      if (activeIndex >= 0 && activeIndex < allTabs.length - 1) {
        const nextTab = allTabs[activeIndex + 1];
        await nextTab.click();
        await this.page.waitForLoadState('networkidle');
        logger.success('Переключено на следующий таб');
      } else {
        logger.warning('Следующий таб не найден');
      }
    } catch (error) {
      logger.error('Ошибка переключения на следующий таб', error as Error);
      throw error;
    }
  }

  /**
   * Переключиться на предыдущий таб
   */
  @LogAction('Переключение на предыдущий таб')
  @ValidateState()
  async selectPreviousTab(): Promise<void> {
    try {
      // Найдем активный таб
      const allTabs = await this.tabItems.all();
      let activeIndex = -1;
      for (let i = 0; i < allTabs.length; i++) {
        const className = await allTabs[i].getAttribute('class');
        if (className?.includes('active')) {
          activeIndex = i;
          break;
        }
      }
      
      if (activeIndex > 0) {
        const previousTab = allTabs[activeIndex - 1];
        await previousTab.click();
        await this.page.waitForLoadState('networkidle');
        logger.success('Переключено на предыдущий таб');
      } else {
        logger.warning('Предыдущий таб не найден');
      }
    } catch (error) {
      logger.error('Ошибка переключения на предыдущий таб', error as Error);
      throw error;
    }
  }
}
