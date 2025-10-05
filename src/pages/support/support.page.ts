/**
 * Support Page - Page Object
 * Страница центра поддержки с табами и контентом
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/abstract/base.page';
import { SupportTabsComponent } from '@components/organisms/support-tabs';
import { SupportContentComponent } from '@components/organisms/support-content';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';
import { Routes } from '@config/routes';

export class SupportPage extends BasePage {
  protected pageName = 'Support Page';
  protected url = Routes.SUPPORT;

  // Компоненты страницы
  readonly pageTitle: Locator;
  readonly supportTabs: SupportTabsComponent;
  readonly supportContent: SupportContentComponent;

  constructor(page: Page) {
    super(page, Routes.SUPPORT, 'Support Page');

    this.pageTitle = page.locator('.page-title');
    this.supportTabs = new SupportTabsComponent(page, page.locator('.tabs.tabs-menu'));
    this.supportContent = new SupportContentComponent(page, page.locator('.container-term .row.flex-col.gap-lg.text-white'));
  }

  // ========== БАЗОВЫЕ МЕТОДЫ СТРАНИЦЫ ==========

  /**
   * Перейти на страницу поддержки
   */
  async navigate(): Promise<void> {
    logger.step(`Navigating to ${this.pageName}`);
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  /**
   * Проверить, загружена ли страница поддержки
   */
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() &&
           await this.supportTabs.isLoaded() &&
           await this.supportContent.isLoaded();
  }

  /**
   * Дождаться загрузки страницы поддержки
   */
  async waitForLoad(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.supportTabs.waitForLoad();
    await this.supportContent.waitForLoad();
    logger.success('Страница центра поддержки загружена');
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Получить заголовок страницы
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Переключиться на таб "Правила и условия"
   */
  async switchToTermsAndConditionsTab(): Promise<void> {
    await this.supportTabs.selectTermsAndConditionsTab();
    logger.step('Переключено на таб "Правила и условия"');
  }

  /**
   * Переключиться на таб "Условия начисления бонусов"
   */
  async switchToBonusTermsTab(): Promise<void> {
    await this.supportTabs.selectBonusTermsTab();
    logger.step('Переключено на таб "Условия начисления бонусов"');
  }

  /**
   * Переключиться на таб "Политика ответственности"
   */
  async switchToResponsibleGameTab(): Promise<void> {
    await this.supportTabs.selectResponsibleGameTab();
    logger.step('Переключено на таб "Политика ответственности"');
  }

  /**
   * Переключиться на таб "Политика конфиденциальности"
   */
  async switchToPrivacyPolicyTab(): Promise<void> {
    await this.supportTabs.selectPrivacyPolicyTab();
    logger.step('Переключено на таб "Политика конфиденциальности"');
  }

  /**
   * Переключиться на таб "Политика честности"
   */
  async switchToFairPlayTab(): Promise<void> {
    await this.supportTabs.selectFairPlayTab();
    logger.step('Переключено на таб "Политика честности"');
  }

  /**
   * Получить содержимое текущего таба
   */
  async getCurrentTabContent(): Promise<string> {
    return await this.supportContent.getCurrentContent();
  }

  /**
   * Получить заголовки всех разделов
   */
  async getAllSectionHeaders(): Promise<string[]> {
    return await this.supportContent.getAllHeaders();
  }

  /**
   * Найти раздел по заголовку
   * @param headerText Текст заголовка
   */
  async findSectionByHeader(headerText: string): Promise<boolean> {
    return await this.supportContent.findSectionByHeader(headerText);
  }

  /**
   * Получить количество разделов
   */
  async getSectionsCount(): Promise<number> {
    return await this.supportContent.getSectionsCount();
  }

  /**
   * Проверить, что контент загружен
   */
  async isContentLoaded(): Promise<boolean> {
    return await this.supportContent.isLoaded();
  }

  /**
   * Получить полную информацию о странице
   */
  async getFullPageInfo(): Promise<{
    pageTitle: string;
    activeTab: string;
    sectionsCount: number;
    headers: string[];
    isLoaded: boolean;
  }> {
    const [pageTitle, activeTab, sectionsCount, headers, isLoaded] = await Promise.all([
      this.getPageTitle(),
      this.supportTabs.getActiveTabName(),
      this.getSectionsCount(),
      this.getAllSectionHeaders(),
      this.isLoaded()
    ]);

    return {
      pageTitle,
      activeTab,
      sectionsCount,
      headers,
      isLoaded
    };
  }
}
