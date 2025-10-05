import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

/**
 * Header Section Component
 * UI-слой для шапки сайта
 */
export class HeaderSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Header Section');
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

  // ========== ЛОКАТОРЫ ==========

  get header(): Locator {
    return this.page.locator('.header');
  }

  get logo(): Locator {
    return this.page.locator('.header .logo, .header .brand, .header .site-logo');
  }

  get userMenu(): Locator {
    return this.page.locator('.header .user-menu, .header .profile-menu, .header .account-menu');
  }

  get loginButton(): Locator {
    return this.page.locator('.header button:has-text("Login"), .header button:has-text("Войти"), .header .login-btn, .header .btn-login');
  }

  get registerButton(): Locator {
    return this.page.locator('.header button:has-text("Register"), .header button:has-text("Регистрация"), .header .register-btn, .header .btn-register');
  }

  get profileButton(): Locator {
    return this.page.locator('.header .profile-button, .header .user-avatar, .header .account-button');
  }

  get walletButton(): Locator {
    return this.page.locator('.header .wallet-button, .header .balance-button, .header .money-button');
  }

  get balance(): Locator {
    return this.page.locator('.header .balance, .header .wallet-balance, .header .money-amount');
  }

  get notifications(): Locator {
    return this.page.locator('.header .notifications, .header .bell-icon, .header .notification-bell');
  }

  get searchButton(): Locator {
    return this.page.locator('.header .search-button, .header .search-toggle, .header .search-icon');
  }

  get languageButton(): Locator {
    return this.page.locator('.header .language-button, .header .lang-toggle, .header .locale-button');
  }

  get menuToggle(): Locator {
    return this.page.locator('.header .menu-toggle, .header .hamburger, .header .mobile-menu-button');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.header.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.header.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== БАЗОВЫЕ UI ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на логотип
   */
  async clickLogo(): Promise<void> {
    logger.step('Clicking header logo');
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кнопку входа
   */
  async clickLogin(): Promise<void> {
    logger.step('Clicking login button');
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кнопку регистрации
   */
  async clickRegister(): Promise<void> {
    logger.step('Clicking register button');
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на профиль пользователя
   */
  async clickProfile(): Promise<void> {
    logger.step('Clicking profile button');
    await this.profileButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кошелек
   */
  async clickWallet(): Promise<void> {
    logger.step('Clicking wallet button');
    await this.walletButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на уведомления
   */
  async clickNotifications(): Promise<void> {
    logger.step('Clicking notifications');
    await this.notifications.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на поиск
   */
  async clickSearch(): Promise<void> {
    logger.step('Clicking search button');
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на язык
   */
  async clickLanguage(): Promise<void> {
    logger.step('Clicking language button');
    await this.languageButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Открыть мобильное меню
   */
  async toggleMobileMenu(): Promise<void> {
    logger.step('Toggling mobile menu');
    await this.menuToggle.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить баланс пользователя
   */
  async getBalance(): Promise<string | null> {
    try {
      return await this.balance.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить текст логотипа
   */
  async getLogoText(): Promise<string | null> {
    try {
      return await this.logo.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить информацию о заголовке
   */
  async getHeaderInfo(): Promise<{
    logoText: string | null;
    balance: string | null;
    hasUserMenu: boolean;
    hasLoginButton: boolean;
    hasProfileButton: boolean;
  }> {
    const [logoText, balance, hasUserMenu, hasLoginButton, hasProfileButton] = await Promise.all([
      this.getLogoText(),
      this.getBalance(),
      this.hasUserMenu(),
      this.hasLoginButton(),
      this.hasProfileButton()
    ]);

    return { logoText, balance, hasUserMenu, hasLoginButton, hasProfileButton };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли шапка
   */
  async isHeaderVisible(): Promise<boolean> {
    return await this.header.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли меню пользователя
   */
  async hasUserMenu(): Promise<boolean> {
    return await this.userMenu.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка входа
   */
  async hasLoginButton(): Promise<boolean> {
    return await this.loginButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка регистрации
   */
  async hasRegisterButton(): Promise<boolean> {
    return await this.registerButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка профиля
   */
  async hasProfileButton(): Promise<boolean> {
    return await this.profileButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка кошелька
   */
  async hasWalletButton(): Promise<boolean> {
    return await this.walletButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли уведомления
   */
  async hasNotifications(): Promise<boolean> {
    return await this.notifications.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка поиска
   */
  async hasSearchButton(): Promise<boolean> {
    return await this.searchButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка языка
   */
  async hasLanguageButton(): Promise<boolean> {
    return await this.languageButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли переключатель мобильного меню
   */
  async hasMobileMenuToggle(): Promise<boolean> {
    return await this.menuToggle.isVisible().catch(() => false);
  }
}
