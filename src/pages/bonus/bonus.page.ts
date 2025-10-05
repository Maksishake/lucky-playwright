/**
 * Bonus Page
 * Страница бонусов с балансом, табами и карточками бонусов
 */

import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/base.page';
import { BonusBalanceComponent } from '@components/organisms/bonus-balance/bonus-balance.component';
import { BonusTabsComponent } from '@components/organisms/bonus-tabs/bonus-tabs.component';
import { BonusCardsSectionComponent } from '@components/organisms/bonus-cards-section/bonus-cards-section.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusPage extends BasePage {
  protected pageName = 'Bonus Page';
  protected url = '/bonuses';

  // ========== КОМПОНЕНТЫ СТРАНИЦЫ ==========

  // Бонусный баланс
  readonly bonusBalance: BonusBalanceComponent;

  // Табы бонусов
  readonly bonusTabs: BonusTabsComponent;

  // Секция карточек бонусов
  readonly bonusCardsSection: BonusCardsSectionComponent;

  constructor(page: Page) {
    super(page, '/bonuses', 'Bonus Page');

    // Инициализация компонентов
    this.bonusBalance = new BonusBalanceComponent(page, page.locator('.bonus-balance'));
    this.bonusTabs = new BonusTabsComponent(page, page.locator('.tabs'));
    this.bonusCardsSection = new BonusCardsSectionComponent(page, page.locator('.row.flex-col.gap-lg'));
  }

  // ========== БАЗОВЫЕ МЕТОДЫ СТРАНИЦЫ ==========

  /**
   * Проверить загрузку страницы бонусов
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isPageLoaded = await this.page.locator('.page-title:has-text("Бонус")').isVisible();
      const isBalanceLoaded = await this.bonusBalance.isLoaded();
      const isTabsLoaded = await this.bonusTabs.isLoaded();
      
      return isPageLoaded && isBalanceLoaded && isTabsLoaded;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки страницы бонусов
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.LONG });
    await this.bonusBalance.waitForLoad();
    await this.bonusTabs.waitForLoad();
    logger.success('Страница бонусов загружена');
  }

  /**
   * Перейти на страницу бонусов
   */
  async navigate(): Promise<void> {
    logger.step('Переход на страницу бонусов');
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  // ========== МЕТОДЫ РАБОТЫ С БОНУСНЫМ БАЛАНСОМ ==========

  /**
   * Получить текущий бонусный баланс
   */
  async getBonusBalance(): Promise<string> {
    return await this.bonusBalance.getCurrentBalance();
  }

  /**
   * Получить сумму для отыгрыша
   */
  async getAmountToWager(): Promise<string> {
    return await this.bonusBalance.getAmountToWager();
  }

  /**
   * Получить оставшуюся сумму до ставки
   */
  async getRemainingToWager(): Promise<string> {
    return await this.bonusBalance.getRemainingToWager();
  }

  /**
   * Применить промокод
   */
  async applyPromocode(promocode: string): Promise<void> {
    await this.bonusBalance.applyPromocode(promocode);
  }

  // ========== МЕТОДЫ РАБОТЫ С ТАБАМИ ==========

  /**
   * Переключиться на таб "Депозит"
   */
  async switchToDepositTab(): Promise<void> {
    await this.bonusTabs.switchToTab('deposit');
  }

  /**
   * Переключиться на таб "Кешбек"
   */
  async switchToCashbackTab(): Promise<void> {
    await this.bonusTabs.switchToTab('cashback');
  }

  /**
   * Переключиться на таб "Подарочный"
   */
  async switchToGiftTab(): Promise<void> {
    await this.bonusTabs.switchToTab('gift');
  }

  /**
   * Получить активный таб
   */
  async getActiveTab(): Promise<string> {
    return await this.bonusTabs.getActiveTab();
  }

  // ========== МЕТОДЫ РАБОТЫ С КАРТОЧКАМИ БОНУСОВ ==========

  /**
   * Получить все карточки бонусов
   */
  async getAllBonusCards(): Promise<any[]> {
    return await this.bonusCardsSection.getAllBonusCards();
  }

  /**
   * Получить карточку бонуса по названию
   */
  async getBonusCardByTitle(title: string): Promise<any> {
    return await this.bonusCardsSection.getBonusCardByTitle(title);
  }

  /**
   * Подписаться на бонус по названию
   */
  async subscribeToBonus(title: string): Promise<void> {
    await this.bonusCardsSection.subscribeToBonus(title);
  }

  /**
   * Открыть детальную информацию о бонусе
   */
  async openBonusDetails(title: string): Promise<void> {
    await this.bonusCardsSection.openBonusDetails(title);
  }

  /**
   * Получить количество доступных бонусов
   */
  async getBonusCardsCount(): Promise<number> {
    return await this.bonusCardsSection.getBonusCardsCount();
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что бонусный баланс отображается
   */
  async isBonusBalanceVisible(): Promise<boolean> {
    return await this.bonusBalance.isVisible();
  }

  /**
   * Проверить, что табы отображаются
   */
  async areTabsVisible(): Promise<boolean> {
    return await this.bonusTabs.isVisible();
  }

  /**
   * Проверить, что карточки бонусов отображаются
   */
  async areBonusCardsVisible(): Promise<boolean> {
    return await this.bonusCardsSection.isVisible();
  }

  /**
   * Проверить, что страница полностью загружена
   */
  async isPageFullyLoaded(): Promise<boolean> {
    const isLoaded = await this.isLoaded();
    const isBalanceVisible = await this.isBonusBalanceVisible();
    const areTabsVisible = await this.areTabsVisible();
    const areCardsVisible = await this.areBonusCardsVisible();
    
    return isLoaded && isBalanceVisible && areTabsVisible && areCardsVisible;
  }
}
