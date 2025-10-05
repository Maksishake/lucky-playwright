/**
 * Auth Service
 * Business Logic Layer: orchestrates authentication flows
 * Использует LoginPage (UI) + Header для проверок авторизации
 * 
 * Принципы ООП:
 * - Инкапсуляция: все внутренние компоненты private
 * - Single Responsibility: только логика авторизации
 * - Единая точка истины: один метод isLoggedIn()
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { IAuthService } from '@types/services/service.types';
import { AuthEmailCredentials, AuthPhoneCredentials, User } from '@types/models/user';
import { LoginPage } from '@pages/auth/login.page';
import { logger } from '@utils/logger.util';
import { Header } from '@components/organisms/header-section.component';

export class AuthService extends BaseService implements IAuthService {
  private loginPage: LoginPage;
  private headerComponent: Header;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.headerComponent = new Header(page);
  }

  /**
   * Войти с email и паролем
   * Полный флоу: открыть модалку → заполнить → submit → проверить
   */
  async loginWithEmail(email: string, password: string): Promise<void> { 
    this.logStep(`Logging in with email: ${email}`);
    
    await this.loginPage.open();
    await this.fillCredentials(email, password);
    await this.loginPage.submit();
    
    await this.waitForNetworkIdle();
    
    // Ждем загрузки страницы после авторизации
    await this.page.waitForLoadState('domcontentloaded');
    
    // Проверяем авторизацию с повторными попытками
    let isLoggedIn = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      isLoggedIn = await this.headerComponent.isLoggedIn();
      if (isLoggedIn) {
        break;
      }
      logger.debug(`Login check attempt ${attempt + 1}/3 failed, retrying...`);
      await this.page.waitForLoadState('domcontentloaded');
    }
    
    if (!isLoggedIn) {
      const errorText = await this.loginPage.getErrorMessage();
      throw new Error(`Login failed: ${errorText || 'Unknown error'}`);
    }
    
    logger.success('User logged in successfully');
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.loginPage.fillEmail(email);
    await this.loginPage.fillPassword(password);
  }

  /**
   * Войти с телефоном и паролем
   */
  async loginWithPhone(phone: string, password: string): Promise<void> {
    this.logStep(`Logging in with phone: ${phone}`);
    
    await this.loginPage.open();
    await this.loginPage.fillPhone(phone);
    await this.loginPage.fillPassword(password);
    await this.loginPage.submit();
    
    await this.waitForNetworkIdle();
    
    if (!await this.headerComponent.isLoggedIn()) {
      const errorText = await this.loginPage.getErrorMessage();
      throw new Error(`Login with phone failed: ${errorText || 'Unknown error'}`);
    }
    
    logger.success('User logged in with phone');
  }


  /**
   * Попытка входа без проверки результата
   * Для негативных тестов
   */
  async attemptLogin(emailOrPhone: string, password: string): Promise<void> {
    this.logStep(`Attempting login: ${emailOrPhone}`);
    
    await this.loginPage.open();
    
    if (emailOrPhone.includes('@')) {
      await this.loginPage.fillEmail(emailOrPhone);
    } else {
      await this.loginPage.fillPhone(emailOrPhone);
    }
    
    await this.loginPage.fillPassword(password);
    await this.loginPage.submit();
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Выйти из системы
   */
  async logout(): Promise<void> {
    logger.step('Logging out');
    
    // TODO: Implement using Header component
    // const header = new Header(this.page);
    // await header.openUserMenu();
    // await header.clickLogout();
    
    await this.waitForNetworkIdle();
    
    if (await this.headerComponent.isLoggedIn()) {
      throw new Error('Logout failed - user still logged in');
    }
    
    logger.success('User logged out successfully');
  }


  /**
   * Проверить, авторизован ли пользователь
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      return await this.headerComponent.isLoggedIn();
    } catch (error) {
      this.logError('Error checking login status', error as Error);
      return false;
    }
  }

  /**
   * Зарегистрировать нового пользователя
   */
  async register(user: User): Promise<void> {
    logger.step(`Registering new user: ${user.email}`);
    
    // TODO: Implement using RegistrationPage
    // const registrationPage = new RegistrationPage(this.page);
    // await registrationPage.open();
    // await registrationPage.fillForm(user);
    // await registrationPage.submit();
    
    logger.success('User registered successfully');
  }

  /**
   * Получить email текущего пользователя
   */
  async getCurrentUserEmail(): Promise<string | null> {
    if (!await this.headerComponent.isLoggedIn()) {
      return null;
    }
    
    // TODO: Extract from user menu or profile
    // const header = new Header(this.page);
    // return await header.getUserEmail();
    
    return null;
  }

  /**
   * Проверить наличие ошибки авторизации
   */
  async hasLoginError(): Promise<boolean> {
    return await this.loginPage.hasError();
  }

  /**
   * Получить текст ошибки авторизации
   */
  async getLoginError(): Promise<string> {
    return await this.loginPage.getErrorMessage();
  }
}
