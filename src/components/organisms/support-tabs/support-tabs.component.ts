/**
 * Support Tabs Component - Organism
 * Компонент табов для центра поддержки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class SupportTabsComponent extends BaseComponent {
  // ========== ЛОКАТОРЫ ==========

  // Навигация табов
  readonly tabNav: Locator;
  readonly tabItems: Locator;

  // Табы
  readonly termsAndConditionsTab: Locator;
  readonly bonusTermsTab: Locator;
  readonly responsibleGameTab: Locator;
  readonly privacyPolicyTab: Locator;
  readonly fairPlayTab: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Support Tabs') {
    super(page, root, componentName);

    this.tabNav = this.root.locator('.tab-nav');
    this.tabItems = this.tabNav.locator('.tab-item');

    // Инициализация табов
    this.termsAndConditionsTab = this.tabItems.filter({ hasText: 'ПРАВИЛА ТА УМОВИ' });
    this.bonusTermsTab = this.tabItems.filter({ hasText: 'УМОВИ НАРАХУВАННЯ БОНУСІВ' });
    this.responsibleGameTab = this.tabItems.filter({ hasText: 'ПОЛІТИКА ВІДПОВІДАЛЬНОСТІ' });
    this.privacyPolicyTab = this.tabItems.filter({ hasText: 'ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ' });
    this.fairPlayTab = this.tabItems.filter({ hasText: 'ПОЛІТИКА ЧЕСНОСТІ' });
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
   * Проверить загрузку компонента табов
   */
  @LogAction('Проверка загрузки компонента табов поддержки')
  @ValidateState()
  async isLoaded(): Promise<boolean> {
    return await this.tabNav.isVisible() && await this.tabItems.first().isVisible();
  }

  /**
   * Дождаться загрузки компонента табов
   */
  @LogAction('Ожидание загрузки компонента табов поддержки')
  async waitForLoad(): Promise<void> {
    await this.tabNav.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.tabItems.first().waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    logger.success('Компонент табов поддержки загружен');
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

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
   * Переключиться на таб "Правила и условия"
   */
  @LogAction('Переключение на таб "Правила и условия"')
  @ValidateState()
  async selectTermsAndConditionsTab(): Promise<void> {
    await this.termsAndConditionsTab.click();
    await this.termsAndConditionsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.termsAndConditionsTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Terms and conditions tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Правила и условия" выбран');
  }

  /**
   * Переключиться на таб "Условия начисления бонусов"
   */
  @LogAction('Переключение на таб "Условия начисления бонусов"')
  @ValidateState()
  async selectBonusTermsTab(): Promise<void> {
    await this.bonusTermsTab.click();
    await this.bonusTermsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.bonusTermsTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Bonus terms tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Условия начисления бонусов" выбран');
  }

  /**
   * Переключиться на таб "Политика ответственности"
   */
  @LogAction('Переключение на таб "Политика ответственности"')
  @ValidateState()
  async selectResponsibleGameTab(): Promise<void> {
    await this.responsibleGameTab.click();
    await this.responsibleGameTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.responsibleGameTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Responsible game tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Политика ответственности" выбран');
  }

  /**
   * Переключиться на таб "Политика конфиденциальности"
   */
  @LogAction('Переключение на таб "Политика конфиденциальности"')
  @ValidateState()
  async selectPrivacyPolicyTab(): Promise<void> {
    await this.privacyPolicyTab.click();
    await this.privacyPolicyTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.privacyPolicyTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Privacy policy tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Политика конфиденциальности" выбран');
  }

  /**
   * Переключиться на таб "Политика честности"
   */
  @LogAction('Переключение на таб "Политика честности"')
  @ValidateState()
  async selectFairPlayTab(): Promise<void> {
    await this.fairPlayTab.click();
    await this.fairPlayTab.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    // Проверяем, что таб стал активным
    const hasActiveClass = await this.fairPlayTab.getAttribute('class');
    if (!hasActiveClass?.includes('active')) {
      throw new Error('Fair play tab did not become active');
    }
    await this.page.waitForLoadState('networkidle');
    logger.success('Таб "Политика честности" выбран');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить названия всех доступных табов
   */
  @LogAction('Получение названий всех табов')
  @ValidateState()
  async getAllTabNames(): Promise<string[]> {
    const tabTexts = await this.tabItems.allTextContents();
    logger.success(`Получены названия всех табов: ${tabTexts.join(', ')}`);
    return tabTexts.map(text => text.trim());
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
  @ValidateState()
  async getTabCount(): Promise<number> {
    const count = await this.tabItems.count();
    logger.success(`Количество табов: ${count}`);
    return count;
  }

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

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что таб "Правила и условия" активен
   */
  @LogAction('Проверка активности таба "Правила и условия"')
  async isTermsAndConditionsTabActive(): Promise<boolean> {
    const className = await this.termsAndConditionsTab.getAttribute('class');
    return className?.includes('active') || false;
  }

  /**
   * Проверить, что таб "Условия начисления бонусов" активен
   */
  @LogAction('Проверка активности таба "Условия начисления бонусов"')
  async isBonusTermsTabActive(): Promise<boolean> {
    const className = await this.bonusTermsTab.getAttribute('class');
    return className?.includes('active') || false;
  }

  /**
   * Проверить, что таб "Политика ответственности" активен
   */
  @LogAction('Проверка активности таба "Политика ответственности"')
  async isResponsibleGameTabActive(): Promise<boolean> {
    const className = await this.responsibleGameTab.getAttribute('class');
    return className?.includes('active') || false;
  }

  /**
   * Проверить, что таб "Политика конфиденциальности" активен
   */
  @LogAction('Проверка активности таба "Политика конфиденциальности"')
  async isPrivacyPolicyTabActive(): Promise<boolean> {
    const className = await this.privacyPolicyTab.getAttribute('class');
    return className?.includes('active') || false;
  }

  /**
   * Проверить, что таб "Политика честности" активен
   */
  @LogAction('Проверка активности таба "Политика честности"')
  async isFairPlayTabActive(): Promise<boolean> {
    const className = await this.fairPlayTab.getAttribute('class');
    return className?.includes('active') || false;
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
