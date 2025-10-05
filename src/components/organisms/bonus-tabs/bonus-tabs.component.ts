/**
 * Bonus Tabs Component - Organism
 * Компонент табов для переключения между типами бонусов
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusTabsComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Контейнер табов
  readonly tabNav: Locator;

  // Табы
  readonly depositTab: Locator;
  readonly cashbackTab: Locator;
  readonly giftTab: Locator;

  // Все табы
  readonly allTabs: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Tabs') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.tabNav = root.locator('.tab-nav');
    this.depositTab = this.tabNav.locator('.tab-item:has-text("Депозит")');
    this.cashbackTab = this.tabNav.locator('.tab-item:has-text("Кешбек")');
    this.giftTab = this.tabNav.locator('.tab-item:has-text("Подарунковий")');
    this.allTabs = this.tabNav.locator('.tab-item');
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
      const isNavVisible = await this.tabNav.isVisible();
      const hasTabs = await this.allTabs.count() > 0;
      
      return isVisible && isNavVisible && hasTabs;
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
    logger.success('Компонент табов бонусов загружен');
  }

  // ========== МЕТОДЫ РАБОТЫ С ТАБАМИ ==========

  /**
   * Переключиться на таб "Депозит"
   */
  @LogAction('Переключение на таб "Депозит"')
  @ValidateState()
  async switchToDepositTab(): Promise<void> {
    await this.depositTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
    logger.success('Переключен на таб "Депозит"');
  }

  /**
   * Переключиться на таб "Кешбек"
   */
  @LogAction('Переключение на таб "Кешбек"')
  @ValidateState()
  async switchToCashbackTab(): Promise<void> {
    await this.cashbackTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
    logger.success('Переключен на таб "Кешбек"');
  }

  /**
   * Переключиться на таб "Подарочный"
   */
  @LogAction('Переключение на таб "Подарочный"')
  @ValidateState()
  async switchToGiftTab(): Promise<void> {
    await this.giftTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
    logger.success('Переключен на таб "Подарочный"');
  }

  /**
   * Переключиться на таб по названию
   */
  @LogAction('Переключение на таб: {tabName}')
  @ValidateState()
  async switchToTab(tabName: string): Promise<void> {
    const tabMap: { [key: string]: Locator } = {
      'deposit': this.depositTab,
      'cashback': this.cashbackTab,
      'gift': this.giftTab
    };

    const tab = tabMap[tabName.toLowerCase()];
    if (tab) {
      await tab.click();
      await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
      logger.success(`Переключен на таб "${tabName}"`);
    } else {
      throw new Error(`Таб "${tabName}" не найден`);
    }
  }

  /**
   * Получить активный таб
   */
  @LogAction('Получение активного таба')
  @ValidateState()
  async getActiveTab(): Promise<string> {
    try {
      const activeTab = this.tabNav.locator('.tab-item.active');
      const tabText = await activeTab.textContent();
      logger.success(`Активный таб: ${tabText}`);
      return tabText || '';
    } catch (error) {
      logger.error('Ошибка получения активного таба', error as Error);
      return '';
    }
  }

  /**
   * Получить все доступные табы
   */
  @LogAction('Получение всех доступных табов')
  @ValidateState()
  async getAllTabs(): Promise<string[]> {
    try {
      const tabs = await this.allTabs.all();
      const tabNames = await Promise.all(
        tabs.map(tab => tab.textContent())
      );
      logger.success(`Доступные табы: ${tabNames.join(', ')}`);
      return tabNames.filter(name => name !== null) as string[];
    } catch (error) {
      logger.error('Ошибка получения табов', error as Error);
      return [];
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что таб "Депозит" активен
   */
  @LogAction('Проверка активности таба "Депозит"')
  async isDepositTabActive(): Promise<boolean> {
    try {
      return await this.depositTab.locator('.active').isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что таб "Кешбек" активен
   */
  @LogAction('Проверка активности таба "Кешбек"')
  async isCashbackTabActive(): Promise<boolean> {
    try {
      return await this.cashbackTab.locator('.active').isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что таб "Подарочный" активен
   */
  @LogAction('Проверка активности таба "Подарочный"')
  async isGiftTabActive(): Promise<boolean> {
    try {
      return await this.giftTab.locator('.active').isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что таб активен
   */
  @LogAction('Проверка активности таба: {tabName}')
  async isTabActive(tabName: string): Promise<boolean> {
    try {
      const tabMap: { [key: string]: () => Promise<boolean> } = {
        'deposit': () => this.isDepositTabActive(),
        'cashback': () => this.isCashbackTabActive(),
        'gift': () => this.isGiftTabActive()
      };

      const checkFunction = tabMap[tabName.toLowerCase()];
      if (checkFunction) {
        return await checkFunction();
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Получить количество табов
   */
  @LogAction('Получение количества табов')
  async getTabsCount(): Promise<number> {
    try {
      const count = await this.allTabs.count();
      logger.success(`Количество табов: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества табов', error as Error);
      return 0;
    }
  }

  /**
   * Проверить, что все табы отображаются
   */
  @LogAction('Проверка отображения всех табов')
  async areAllTabsVisible(): Promise<boolean> {
    try {
      const depositVisible = await this.depositTab.isVisible();
      const cashbackVisible = await this.cashbackTab.isVisible();
      const giftVisible = await this.giftTab.isVisible();
      
      return depositVisible && cashbackVisible && giftVisible;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что табы кликабельны
   */
  @LogAction('Проверка кликабельности табов')
  async areTabsClickable(): Promise<boolean> {
    try {
      const depositEnabled = await this.depositTab.isEnabled();
      const cashbackEnabled = await this.cashbackTab.isEnabled();
      const giftEnabled = await this.giftTab.isEnabled();
      
      return depositEnabled && cashbackEnabled && giftEnabled;
    } catch {
      return false;
    }
  }
}
