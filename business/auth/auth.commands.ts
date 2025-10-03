import { Page, expect } from '@playwright/test';
import { AuthTestData } from '../../test-data/auth/auth-test-data';
import { Routes } from '../../config/routes';

/**
 * Команды авторизации обьединяющие UI действия в сценарии
 */
export class AuthCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any, // TODO: заменить на специализированные фабрики
    private readonly modalFactory: any
  ) {}

  /**
   * Полный сценарий авторизации по email
   */
  async loginWithEmail(email?: string, password?: string): Promise<void> {
    const header = this.pageFactory.createHeader();
    const loginModal = this.modalFactory.createLoginModal();
    const bitcapitalModal = this.modalFactory.createBitcapitalModal();
    // Шаг 1: Открыть модальное окно
    await header.clickLogin();
    await loginModal.waitForLoad();

    // Шаг 2: Переключиться на таб входа
    await loginModal.clickLoginTab();

    // Шаг 3: Заполнить форму
    await loginModal.fillEmail(email || AuthTestData.valid.email);
    await loginModal.fillPassword(password || AuthTestData.valid.password);

    // Шаг 4: Отправить форму
    await loginModal.clickSubmit();

    // Шаг 5: Проверить успешную авторизацию
    await this.verifyLoginSuccess();
    await bitcapitalModal.clickCloseButton();
  }

  /**
   * Полный сценарий авторизации по телефону
   */
  async loginWithPhone(phone?: string, password?: string): Promise<void> {
    const header = this.pageFactory.createHeader();
    const loginModal = this.modalFactory.createLoginModal();

    await header.clickLogin();
    await loginModal.waitForLoad();
    await loginModal.clickLoginTab();
    await loginModal.fillPhone(phone || AuthTestData.valid.phone);
    await loginModal.fillPassword(password || AuthTestData.valid.password);
    await loginModal.clickSubmit();

    await this.verifyLoginSuccess();
  }

  /**
   * Авторизация с валидными данными по умолчанию
   */
  async loginWithValidCredentials(): Promise<void> {
    await this.loginWithEmail();
  }

  /**
   * Авторизация с невалидными данными
   */
  async loginWithInvalidCredentials(): Promise<void> {
    await this.loginWithEmail(
      AuthTestData.invalid.wrongEmail,
      AuthTestData.invalid.wrongPassword
    );
  }

  /**
   * Проверяет, залогинен ли пользователь
   */
  async isUserLoggedIn(): Promise<boolean> {
    const header = this.pageFactory.createHeader();
    return await header.isLoggedIn();
  }

  /**
   * Гарантирует, что пользователь авторизован
   */
  async ensureLoggedIn(): Promise<void> {
    /*await this.page.goto(Routes.HOME);
    await this.page.waitForLoadState('domcontentloaded');*/

    const isLoggedIn = await this.isUserLoggedIn();
    if (!isLoggedIn) {
      await this.loginWithValidCredentials();
    }
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    const header = this.pageFactory.createHeader();
    const userProfileModal = this.modalFactory.createUserProfileModal();

    // Открыть профиль
    await header.clickElement('avatar-dropdown');
    await userProfileModal.waitForLoad();

    // Выйти из системы (через закрытие профиля)
    await userProfileModal.close();

    // Проверить, что пользователь вышел
    await expect(async () => {
      const isLoggedIn = await this.isUserLoggedIn();
      expect(isLoggedIn).toBeFalsy();
    }).toPass({ timeout: 10000 });
  }

  /**
   * Проверка успешной авторизации
   */
  private async verifyLoginSuccess(): Promise<void> {
    await expect(async () => {
      const isLoggedIn = await this.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    }).toPass({ timeout: 10000 });
  }

  /**
   * Проверка неуспешной авторизации
   */
  async verifyLoginFailure(): Promise<void> {
    const loginModal = this.modalFactory.createLoginModal();
    
    // Проверяем, что модальное окно все еще открыто
    const isOpen = await loginModal.isOpen();
    expect(isOpen).toBeTruthy();
    
    // Проверяем наличие ошибки
    const hasError = await loginModal.isErrorVisible();
    expect(hasError).toBeTruthy();
  }

  /**
   * Очистка состояния авторизации
   */
  async clearAuthState(): Promise<void> {
    const isLoggedIn = await this.isUserLoggedIn();
    if (isLoggedIn) {
      await this.logout();
    }
  }
}
