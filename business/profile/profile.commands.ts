import { Page, expect } from '@playwright/test';

/**
 * Команды профиля (бизнес-логика)
 * Объединяют несколько UI действий в сценарии
 */
export class ProfileCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any,
    private readonly modalFactory: any
  ) {}

  /**
   * Открыть профиль пользователя
   */
  async openProfile(): Promise<void> {
    const header = this.pageFactory.createHeader();
    const userProfileModal = this.modalFactory.createUserProfileModal();

    await header.clickAvatar();
    await userProfileModal.waitForLoad();
  }

  /**
   * Закрыть профиль пользователя
   */
  async closeProfile(): Promise<void> {
    const userProfileModal = this.modalFactory.createUserProfileModal();
    await userProfileModal.close();
  }

  /**
   * Получить email пользователя
   */
  async getUserEmail(): Promise<string> {
    await this.openProfile();
    
    const userProfileModal = this.modalFactory.createUserProfileModal();
    const email = await userProfileModal.profile.getEmail();
    
    await this.closeProfile();
    return email;
  }

  /**
   * Получить информацию о бонусах
   */
  async getBonusInfo(): Promise<{
    balance: string;
    wagerAmount: string;
    remaining: string;
  }> {
    await this.openProfile();
    
    const userProfileModal = this.modalFactory.createUserProfileModal();
    const balance = await userProfileModal.bonus.getBalance();
    const wagerAmount = await userProfileModal.bonus.getAmountToWager();
    const remaining = await userProfileModal.bonus.getAmountRemaining();
    
    await this.closeProfile();
    
    return { balance, wagerAmount, remaining };
  }

  /**
   * Открыть и проверить раздел профиля
   */
  async openAndVerifySection(
    sectionName: 'userInfo' | 'wallet' | 'statistics' | 'bonuses' | 'transactions' | 'verification' | 'security'
  ): Promise<void> {
    await this.openProfile();
    
    const userProfileModal = this.modalFactory.createUserProfileModal();
    
    // Переход к разделу
    switch (sectionName) {
      case 'userInfo':
        await userProfileModal.navigation.openUserInfo();
        break;
      case 'wallet':
        await userProfileModal.navigation.openWallet();
        break;
      case 'statistics':
        await userProfileModal.navigation.openStatistics();
        break;
      case 'bonuses':
        await userProfileModal.navigation.goToBonuses();
        break;
      case 'transactions':
        await userProfileModal.navigation.openTransactions();
        break;
      case 'verification':
        await userProfileModal.navigation.goToVerification();
        break;
      case 'security':
        await userProfileModal.navigation.openSecurity();
        break;
    }
    
    await this.closeProfile();
  }

  /**
   * Изменить язык интерфейса
   */
  async changeLanguage(): Promise<void> {
    await this.openProfile();
    
    const userProfileModal = this.modalFactory.createUserProfileModal();
    await userProfileModal.language.click();
    await userProfileModal.language.selectUA();
    
    await this.closeProfile();
  }

  /**
   * Проверить полноту информации профиля
   */
  async verifyProfileCompleteness(): Promise<{
    hasEmail: boolean;
    hasAvatar: boolean;
    hasBonusInfo: boolean;    
  }> {
    await this.openProfile();
    
    const userProfileModal = this.modalFactory.createUserProfileModal();
    const hasEmail = await userProfileModal.isEmailVisible();
    const hasAvatar = await userProfileModal.isAvatarVisible();
    const hasBonusInfo = await userProfileModal.isBonusBalanceVisible();
    
    await this.closeProfile();
    
    return { hasEmail, hasAvatar, hasBonusInfo };
  }
}
