import { Locator, expect } from '@playwright/test';
import { BasePageObject } from '../base/base-page-object';

export enum HeaderItem {
  Header = 'header',
  LoginButton = 'login-button',
  RegistrationButton = 'registration-button',
  LanguageButton = 'language-button',
  BonusesButton = 'bonuses-button',
  LogoLink = 'logo-link',
  LogoImage = 'logo-image',
  SearchButton = 'search-button',
  NavbarToggle = 'navbar-toggle',
  WalletButton = 'wallet-button',
  AvatarDropdown = 'avatar-dropdown',
  Balance = 'balance',
  DepositButton = 'deposit-button',
}

/**
 * Page Object для Header компонента
 * ТОЛЬКО UI-слой: локаторы + базовые действия
 */
export class HeaderComponent extends BasePageObject {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    header: () => this.page.locator('.header'),
    loginButton: () => this.page.getByRole('button', { name: 'Увійти' }),
    registrationButton: () => this.page.getByRole('button', { name: 'Реєстрація' }),
    languageButton: () => this.page.locator('.btn-lang-wrapper .btn-lang'),
    bonusesButton: () => this.page.locator('a.btn-bonus', { hasText: 'Бонуси' }),
    searchButton: () => this.page.locator("button.search-toggle[x-data]").first(),
    logoLink: () => this.page.locator('.navbar-brand a'),
    logoImage: () => this.page.locator('.navbar-brand img'),
    navbarToggle: () => this.page.locator('button.navbar-toggle'),
    walletButton: () => this.page.locator('[data-testid="wallet-btn"], button[onclick*="modal-wallet-main"]'),
    avatarDropdown: () => this.page.locator('span.avatar-drop-arrow.icon'),
    balance: () => this.page.locator('.wallet-block.wallet-toggle .price span'),
    depositButton: () => this.page.locator('button:has-text("Поповнити")'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========
  
  async isLoaded(): Promise<boolean> {
    try {
      const loginBtn = this.locators.loginButton();
      const regBtn = this.locators.registrationButton();
      return (await loginBtn.isVisible()) || (await regBtn.isVisible());
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ========== БАЗОВЫЕ UI ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на кнопку входа
   */
  async clickLogin(): Promise<void> {
    await this.locators.loginButton().click();
  }

  /**
   * Кликнуть на кнопку регистрации
   */
  async clickRegistration(): Promise<void> {
    await this.locators.registrationButton().click();
  }

  /**
   * Кликнуть на кнопку кошелька
   */
  async clickWallet(): Promise<void> {
    await this.locators.walletButton().click();
  }

  /**
   * Кликнуть на кнопку языка
   */
  async clickLanguage(): Promise<void> {
    await this.locators.languageButton().click();
  }

  /**
   * Кликнуть на логотип
   */
  async clickLogo(): Promise<void> {
    await this.locators.logoLink().click();
  }

  /**
   * @deprecated Используйте clickLogo()
   */
  async clickLogoLink(): Promise<void> {
    await this.clickLogo();
  }

  /**
   * Кликнуть на поиск
   */
  async clickSearch(): Promise<void> {
    await this.locators.searchButton().click();
  }

  /**
   * Кликнуть на бонусы
   */
  async clickBonuses(): Promise<void> {
    await this.locators.bonusesButton().click();
  }

  /**
   * Кликнуть на аватар
   */
  async clickAvatar(): Promise<void> {
    await this.locators.avatarDropdown().click();
  }

  /**
   * Кликнуть на депозит
   */
  async clickDeposit(): Promise<void> {
    await this.locators.depositButton().click();
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ UI ==========

  /**
   * Проверить, авторизован ли пользователь
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      return await this.locators.balance().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Получить текст баланса
   */
  async getBalanceText(): Promise<string | null> {
    try {
      return await this.locators.balance().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Проверить видимость логотипа
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.locators.logoLink().isVisible().catch(() => false);
  }

  /**
   * Проверить видимость кнопки языка
   */
  async isLanguageButtonVisible(): Promise<boolean> {
    return await this.locators.languageButton().isVisible().catch(() => false);
  }

  /**
   * Проверить видимость кнопки депозита
   */
  async isDepositButtonVisible(): Promise<boolean> {
    return await this.locators.depositButton().isVisible().catch(() => false);
  }

  /**
   * @deprecated Используйте clickLanguage()
   */
  async clickLanguageButton(): Promise<void> {
    await this.clickLanguage();
  }

  /**
   * @deprecated Используйте isLanguageButtonVisible()
   */
  async expectVisibleLanguageButton(): Promise<void> {
    const isVisible = await this.isLanguageButtonVisible();
    if (!isVisible) {
      throw new Error('Language button is not visible');
    }
  }

  /**
   * @deprecated Используйте isLanguageButtonVisible()
   */
  async expectVisibleLanguageOption(): Promise<void> {
    const isVisible = await this.isLanguageButtonVisible();
    if (!isVisible) {
      throw new Error('Language option is not visible');
    }
  }

  /**
   * @deprecated Используйте isLogoVisible()
   */
  get logoLink() {
    return {
      isVisible: () => this.isLogoVisible()
    };
  }

  /**
   * @deprecated Используйте clickDeposit()
   */
  get account() {
    return {
      isDepositButtonVisible: () => this.isDepositButtonVisible(),
      clickDeposit: () => this.clickDeposit()
    };
  }

  /**
   * Универсальный метод для клика по элементу
   */
  async clickElement(item: HeaderItem): Promise<void> {
    const locatorMap: Record<HeaderItem, () => Locator> = {
      [HeaderItem.Header]: this.locators.header,
      [HeaderItem.LoginButton]: this.locators.loginButton,
      [HeaderItem.RegistrationButton]: this.locators.registrationButton,
      [HeaderItem.LanguageButton]: this.locators.languageButton,
      [HeaderItem.BonusesButton]: this.locators.bonusesButton,
      [HeaderItem.LogoLink]: this.locators.logoLink,
      [HeaderItem.LogoImage]: this.locators.logoImage,
      [HeaderItem.NavbarToggle]: this.locators.navbarToggle,
      [HeaderItem.SearchButton]: this.locators.searchButton,
      [HeaderItem.WalletButton]: this.locators.walletButton,
      [HeaderItem.AvatarDropdown]: this.locators.avatarDropdown,
      [HeaderItem.Balance]: this.locators.balance,
      [HeaderItem.DepositButton]: this.locators.depositButton,
    };

    const locator = locatorMap[item];
    if (locator) {
      await locator().click();
    }
  }

  /**
   * Универсальный метод для проверки видимости элемента
   */
  async isElementVisible(item: HeaderItem): Promise<boolean> {
    const locatorMap: Record<HeaderItem, () => Locator> = {
      [HeaderItem.Header]: this.locators.header,
      [HeaderItem.LoginButton]: this.locators.loginButton,
      [HeaderItem.RegistrationButton]: this.locators.registrationButton,
      [HeaderItem.LanguageButton]: this.locators.languageButton,
      [HeaderItem.BonusesButton]: this.locators.bonusesButton,
      [HeaderItem.LogoLink]: this.locators.logoLink,
      [HeaderItem.LogoImage]: this.locators.logoImage,
      [HeaderItem.NavbarToggle]: this.locators.navbarToggle,
      [HeaderItem.SearchButton]: this.locators.searchButton,
      [HeaderItem.WalletButton]: this.locators.walletButton,
      [HeaderItem.AvatarDropdown]: this.locators.avatarDropdown,
      [HeaderItem.Balance]: this.locators.balance,
      [HeaderItem.DepositButton]: this.locators.depositButton,
    };

    const locator = locatorMap[item];
    if (locator) {
      return await locator().isVisible().catch(() => false);
    }
    return false;
  }
}
