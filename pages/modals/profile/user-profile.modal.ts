import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Элементы модального окна профиля пользователя
 */
export enum UserProfileModalItem {
  // Основные элементы
  Modal = 'modal',
  Avatar = 'avatar',
  Email = 'email',
  UserId = 'user-id',
  
  // Кнопки верхнего блока
  SettingsButton = 'settings-button',
  LanguageButton = 'language-button',
  LanguageDropdown = 'language-dropdown',
  LanguageOption = 'language-option',
  LanguageOptionUA = 'language-option-ua',
  
  // Бонусный баланс
  BonusBalance = 'bonus-balance',
  BonusBalanceButton = 'bonus-balance-button',
  BonusProgressBar = 'bonus-progress-bar',
  BonusAmountToWager = 'bonus-amount-to-wager',
  BonusAmountRemaining = 'bonus-amount-remaining',
  
  // Навигация
  UserInfoLink = 'user-info-link',
  WalletLink = 'wallet-link',
  StatisticsLink = 'statistics-link',
  BonusLink = 'bonus-link',
  TransactionsLink = 'transactions-link',
  SupportLink = 'support-link',
  UserDetailsLink = 'user-details-link',
  VerificationLink = 'verification-link',
  SecurityLink = 'security-link',
}

/**
 * Page Object для модального окна профиля пользователя
 */
export class UserProfileModal extends BaseModal {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    // Основные элементы
    modal: () => this.page.locator('.avatar-user-profile'),
    avatar: () => this.page.locator('.avatar-user-profile__image'),
    email: () => this.page.locator('.avatar-user-profile__title'),
    userId: () => this.page.locator('.user-id.badge'),
    
    // Верхний блок
    settingsButton: () => this.page.locator('.badge.bg-gray a[href*="settings"]'),
    languageButton: () => this.page.locator('.btn-lang-wrapper .btn-lang'),
    languageDropdown: () => this.page.locator('.lang-dropdown'),
    languageOption: () => this.page.locator('.lang-dropdown-list li:has-text("")'),
    languageOptionUA: () => this.page.locator('.lang-dropdown-list li:has-text("Український")'),
    
    // Бонусный баланс
    bonusBalance: () => this.page.locator('.bonus-info .title'),
    bonusBalanceButton: () => this.page.locator('.bonus-info a[href*="bonuses"]'),
    bonusProgressBar: () => this.page.locator('.bonus-info .progress-bar'),
    bonusAmountToWager: () => this.page.locator('.bonus-info .bonus-left span').first(),
    bonusAmountRemaining: () => this.page.locator('.bonus-info .bonus-right span').first(),
    
    // Навигация
    userInfoLink: () => this.page.locator('.user-info-nav li:has-text("Інформація про користувача")'),
    walletLink: () => this.page.locator('.user-info-nav li:has-text("Гаманець")'),
    statisticsLink: () => this.page.locator('.user-info-nav li:has-text("Статистика")'),
    bonusLink: () => this.page.locator('.user-info-nav li:has-text("Бонус")'),
    transactionsLink: () => this.page.locator('.user-info-nav li:has-text("Транзакції")'),
    supportLink: () => this.page.locator('.user-info-nav li:has-text("Підтримка онлайн")'),
    userDetailsLink: () => this.page.locator('.user-info-nav li:has-text("Деталі користувача")'),
    verificationLink: () => this.page.locator('.user-info-nav li:has-text("Верифікація")'),
    securityLink: () => this.page.locator('.user-info-nav li:has-text("Безпека")'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.locators.modal()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ МОДАЛЬНОГО ОКНА ==========

  async isOpen(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async open(): Promise<void> {
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    // Профиль закрывается кликом вне модалки
    await this.page.keyboard.press('Escape');
  }

  // ========== ПОЛУЧЕНИЕ ИНФОРМАЦИИ ==========

  /**
   * Получить email пользователя
   */
  async getEmail(): Promise<string | null> {
    try {
      return await this.locators.email().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить ID пользователя
   */
  async getUserId(): Promise<string | null> {
    try {
      const userId = await this.locators.userId().textContent();
      return userId?.trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Получить бонусный баланс
   */
  async getBonusBalance(): Promise<string | null> {
    try {
      return await this.locators.bonusBalance().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить сумму для отыгрыша
   */
  async getBonusAmountToWager(): Promise<string | null> {
    try {
      return await this.locators.bonusAmountToWager().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить остаток до ставки
   */
  async getBonusAmountRemaining(): Promise<string | null> {
    try {
      return await this.locators.bonusAmountRemaining().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить прогресс бонуса (в процентах)
   */
  async getBonusProgress(): Promise<number> {
    try {
      const progressBar = this.locators.bonusProgressBar();
      const style = await progressBar.getAttribute('style');
      const match = style?.match(/width:\s*(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    } catch {
      return 0;
    }
  }

  // ========== ДЕЙСТВИЯ С ВЕРХНИМ БЛОКОМ ==========

  /**
   * Кликнуть на кнопку настроек
   */
  async clickSettings(): Promise<void> {
    await this.locators.settingsButton().click();
  }

  /**
   * Кликнуть на кнопку языка
   */
  async clickLanguageButton(): Promise<void> {
    await this.locators.languageButton().click();
  }

  /**
   * Выбрать язык (Украинский)
   */
  async selectLanguageUA(): Promise<void> {
    await this.clickLanguageButton();
    await this.locators.languageOptionUA().click();
  }

  // ========== НАВИГАЦИЯ ==========

  /**
   * Открыть информацию о пользователе
   */
  async openUserInfo(): Promise<void> {
    await this.locators.userInfoLink().click();
  }

  /**
   * Открыть кошелек
   */
  async openWallet(): Promise<void> {
    await this.locators.walletLink().click();
  }

  /**
   * Открыть статистику
   */
  async openStatistics(): Promise<void> {
    await this.locators.statisticsLink().click();
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<void> {
    await this.locators.bonusLink().click();
  }

  /**
   * Открыть транзакции
   */
  async openTransactions(): Promise<void> {
    await this.locators.transactionsLink().click();
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<void> {
    await this.locators.supportLink().click();
  }

  /**
   * Открыть детали пользователя
   */
  async openUserDetails(): Promise<void> {
    await this.locators.userDetailsLink().click();
  }

  /**
   * Перейти к верификации
   */
  async goToVerification(): Promise<void> {
    await this.locators.verificationLink().click();
  }

  /**
   * Открыть безопасность
   */
  async openSecurity(): Promise<void> {
    await this.locators.securityLink().click();
  }

  /**
   * Кликнуть на бонусный баланс
   */
  async clickBonusBalance(): Promise<void> {
    await this.locators.bonusBalanceButton().click();
  }

  // ========== ПРОВЕРКИ ВИДИМОСТИ ==========

  /**
   * Проверить видимость аватара
   */
  async isAvatarVisible(): Promise<boolean> {
    try {
      return await this.locators.avatar().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить видимость email
   */
  async isEmailVisible(): Promise<boolean> {
    try {
      return await this.locators.email().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить видимость бонусного баланса
   */
  async isBonusBalanceVisible(): Promise<boolean> {
    try {
      return await this.locators.bonusBalance().isVisible();
    } catch {
      return false;
    }
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Получить локатор элемента по типу
   */
  private getLocator(item: UserProfileModalItem): Locator {
    const locatorMap: Record<UserProfileModalItem, () => Locator> = {
      [UserProfileModalItem.Modal]: this.locators.modal,
      [UserProfileModalItem.Avatar]: this.locators.avatar,
      [UserProfileModalItem.Email]: this.locators.email,
      [UserProfileModalItem.UserId]: this.locators.userId,
      [UserProfileModalItem.SettingsButton]: this.locators.settingsButton,
      [UserProfileModalItem.LanguageButton]: this.locators.languageButton,
      [UserProfileModalItem.LanguageDropdown]: this.locators.languageDropdown,
      [UserProfileModalItem.LanguageOption]: this.locators.languageOption,
      [UserProfileModalItem.LanguageOptionUA]: this.locators.languageOptionUA,
      [UserProfileModalItem.BonusBalance]: this.locators.bonusBalance,
      [UserProfileModalItem.BonusBalanceButton]: this.locators.bonusBalanceButton,
      [UserProfileModalItem.BonusProgressBar]: this.locators.bonusProgressBar,
      [UserProfileModalItem.BonusAmountToWager]: this.locators.bonusAmountToWager,
      [UserProfileModalItem.BonusAmountRemaining]: this.locators.bonusAmountRemaining,
      [UserProfileModalItem.UserInfoLink]: this.locators.userInfoLink,
      [UserProfileModalItem.WalletLink]: this.locators.walletLink,
      [UserProfileModalItem.StatisticsLink]: this.locators.statisticsLink,
      [UserProfileModalItem.BonusLink]: this.locators.bonusLink,
      [UserProfileModalItem.TransactionsLink]: this.locators.transactionsLink,
      [UserProfileModalItem.SupportLink]: this.locators.supportLink,
      [UserProfileModalItem.UserDetailsLink]: this.locators.userDetailsLink,
      [UserProfileModalItem.VerificationLink]: this.locators.verificationLink,
      [UserProfileModalItem.SecurityLink]: this.locators.securityLink,
    };

    return locatorMap[item]();
  }

  /**
   * Проверить видимость элемента
   */
  async isElementVisible(item: UserProfileModalItem): Promise<boolean> {
    try {
      return await this.getLocator(item).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Кликнуть на элемент
   */
  async clickElement(item: UserProfileModalItem): Promise<void> {
    await this.getLocator(item).click();
  }

  // ========== ГРУППИРОВАННЫЕ МЕТОДЫ ==========

  /**
   * Группа методов для работы с профилем
   */
  profile = {
    getEmail: async (): Promise<string | null> => {
      return await this.getEmail();
    },
    
    getUserId: async (): Promise<string | null> => {
      return await this.getUserId();
    },
    
    clickSettings: async (): Promise<void> => {
      await this.clickSettings();
    },
    
    isAvatarVisible: async (): Promise<boolean> => {
      return await this.isAvatarVisible();
    },
  };

  /**
   * Группа методов для работы с бонусами
   */
  bonus = {
    getBalance: async (): Promise<string | null> => {
      return await this.getBonusBalance();
    },
    
    getProgress: async (): Promise<number> => {
      return await this.getBonusProgress();
    },
    
    getAmountToWager: async (): Promise<string | null> => {
      return await this.getBonusAmountToWager();
    },
    
    getAmountRemaining: async (): Promise<string | null> => {
      return await this.getBonusAmountRemaining();
    },
    
    clickBalance: async (): Promise<void> => {
      await this.clickBonusBalance();
    },
    
    isVisible: async (): Promise<boolean> => {
      return await this.isBonusBalanceVisible();
    },
  };

  /**
   * Группа методов для навигации
   */
  navigation = {
    openUserInfo: async (): Promise<void> => {
      await this.openUserInfo();
    },
    
    openWallet: async (): Promise<void> => {
      await this.openWallet();
    },
    
    openStatistics: async (): Promise<void> => {
      await this.openStatistics();
    },
    
    goToBonuses: async (): Promise<void> => {
      await this.goToBonuses();
    },
    
    openTransactions: async (): Promise<void> => {
      await this.openTransactions();
    },
    
    openSupport: async (): Promise<void> => {
      await this.openSupport();
    },
    
    openUserDetails: async (): Promise<void> => {
      await this.openUserDetails();
    },
    
    goToVerification: async (): Promise<void> => {
      await this.goToVerification();
    },
    
    openSecurity: async (): Promise<void> => {
      await this.openSecurity();
    },
  };

  /**
   * Группа методов для работы с языком
   */
  language = {
    click: async (): Promise<void> => {
      await this.clickLanguageButton();
    },
    
    selectUA: async (): Promise<void> => {
      await this.selectLanguageUA();
    },
  };

  /**
   * @deprecated Используйте navigation.* методы
   */
  get menu() {
    return {
      clickTransactions: () => this.openTransactions(),
      isTransactionsVisible: () => this.isElementVisible(UserProfileModalItem.TransactionsLink),
      clickVerification: () => this.goToVerification(),
      isVerificationVisible: () => this.isElementVisible(UserProfileModalItem.VerificationLink),
      clickSecurity: () => this.openSecurity(),
      isSecurityVisible: () => this.isElementVisible(UserProfileModalItem.SecurityLink)
    };
  }

  /**
   * @deprecated Используйте bonus.isVisible()
   */
  get modal() {
    return {
      isVisible: () => this.isLoaded()
    };
  }
}

