/**
 * Profile Modal Component
 * UI-слой для модального окна профиля пользователя
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class ProfileModalComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Profile Modal');
  }

  // ========== ЛОКАТОРЫ ==========

  get avatarImage(): Locator {
    return this.page.locator('.avatar-user-profile__image');
  }

  get userName(): Locator {
    return this.page.locator('.avatar-user-profile__name');
  }

  get userEmail(): Locator {
    return this.page.locator('.avatar-user-profile__email');
  }

  get bonusBalance(): Locator {
    return this.page.locator('.avatar-user-profile__bonus-balance');
  }

  get bonusProgress(): Locator {
    return this.page.locator('.avatar-user-profile__bonus-progress');
  }

  get wireId(): Locator {
    return this.page.locator('.avatar-user-profile__wire-id');
  }

  get overviewButton(): Locator {
    return this.page.locator('.avatar-user-profile__overview-button, .avatar-user-profile button:has-text("Overview")');
  }

  get statisticsButton(): Locator {
    return this.page.locator('.avatar-user-profile__statistics-button, .avatar-user-profile button:has-text("Statistics")');
  }

  get historyButton(): Locator {
    return this.page.locator('.avatar-user-profile__history-button, .avatar-user-profile button:has-text("History")');
  }

  get walletButton(): Locator {
    return this.page.locator('.avatar-user-profile__wallet-button, .avatar-user-profile button:has-text("Wallet")');
  }

  get securityButton(): Locator {
    return this.page.locator('.avatar-user-profile__security-button, .avatar-user-profile button:has-text("Security")');
  }

  get userDetailsButton(): Locator {
    return this.page.locator('.avatar-user-profile__user-details-button, .avatar-user-profile button:has-text("User Details")');
  }

  get closeButton(): Locator {
    return this.page.locator('.avatar-user-profile .modal-close, .avatar-user-profile .close-button, .avatar-user-profile [data-dismiss="modal"]');
  }

  get modal(): Locator {
    return this.page.locator('.avatar-user-profile');
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

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.modal.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.modal.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== БАЗОВЫЕ UI ДЕЙСТВИЯ ==========

  /**
   * Закрыть модальное окно профиля
   */
  async close(): Promise<void> {
    logger.step('Closing profile modal');
    await this.closeButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Profile modal closed');
  }

  /**
   * Показать обзор профиля
   */
  async showOverview(): Promise<void> {
    logger.step('Showing profile overview');
    await this.overviewButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Profile overview shown');
  }

  /**
   * Показать статистику профиля
   */
  async showStatistics(): Promise<void> {
    logger.step('Showing profile statistics');
    await this.statisticsButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Profile statistics shown');
  }

  /**
   * Показать историю профиля
   */
  async showHistory(): Promise<void> {
    logger.step('Showing profile history');
    await this.historyButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Profile history shown');
  }

  /**
   * Показать кошелек
   */
  async showWallet(): Promise<void> {
    logger.step('Showing wallet');
    await this.walletButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Wallet shown');
  }

  /**
   * Показать безопасность
   */
  async showSecurity(): Promise<void> {
    logger.step('Showing security settings');
    await this.securityButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Security settings shown');
  }

  /**
   * Показать детали пользователя
   */
  async showUserDetails(): Promise<void> {
    logger.step('Showing user details');
    await this.userDetailsButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('User details shown');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить имя пользователя
   */
  async getUserName(): Promise<string | null> {
    try {
      return await this.userName.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить email пользователя
   */
  async getUserEmail(): Promise<string | null> {
    try {
      return await this.userEmail.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить баланс бонусов
   */
  async getBonusBalance(): Promise<string | null> {
    try {
      return await this.bonusBalance.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить прогресс бонусов
   */
  async getBonusProgress(): Promise<number> {
    try {
      const progressText = await this.bonusProgress.textContent();
      return progressText ? parseInt(progressText.replace(/\D/g, ''), 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Получить Wire ID
   */
  async getWireId(): Promise<string | null> {
    try {
      return await this.wireId.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить URL аватара
   */
  async getAvatarUrl(): Promise<string | null> {
    try {
      return await this.avatarImage.getAttribute('src');
    } catch {
      return null;
    }
  }

  /**
   * Получить полную информацию о профиле
   */
  async getProfileInfo(): Promise<{
    userName: string | null;
    userEmail: string | null;
    bonusBalance: string | null;
    bonusProgress: number;
    wireId: string | null;
    avatarUrl: string | null;
  }> {
    const [userName, userEmail, bonusBalance, bonusProgress, wireId, avatarUrl] = await Promise.all([
      this.getUserName(),
      this.getUserEmail(),
      this.getBonusBalance(),
      this.getBonusProgress(),
      this.getWireId(),
      this.getAvatarUrl()
    ]);

    return { userName, userEmail, bonusBalance, bonusProgress, wireId, avatarUrl };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видимо ли модальное окно профиля
   */
  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка обзора
   */
  async hasOverviewButton(): Promise<boolean> {
    return await this.overviewButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка статистики
   */
  async hasStatisticsButton(): Promise<boolean> {
    return await this.statisticsButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка истории
   */
  async hasHistoryButton(): Promise<boolean> {
    return await this.historyButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка кошелька
   */
  async hasWalletButton(): Promise<boolean> {
    return await this.walletButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка безопасности
   */
  async hasSecurityButton(): Promise<boolean> {
    return await this.securityButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка деталей пользователя
   */
  async hasUserDetailsButton(): Promise<boolean> {
    return await this.userDetailsButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка закрытия
   */
  async hasCloseButton(): Promise<boolean> {
    return await this.closeButton.isVisible().catch(() => false);
  }

  /**
   * Дождаться открытия модального окна
   */
  async waitForOpen(): Promise<void> {
    logger.step('Waiting for profile modal to open');
    await this.modal.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    logger.success('Profile modal opened');
  }

  /**
   * Дождаться закрытия модального окна
   */
  async waitForClose(): Promise<void> {
    logger.step('Waiting for profile modal to close');
    await this.modal.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM });
    logger.success('Profile modal closed');
  }
}
