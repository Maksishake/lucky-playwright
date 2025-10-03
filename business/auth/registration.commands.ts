import { Page, expect } from '@playwright/test';
import { AuthTestData } from '../../test-data/auth/auth-test-data';

export interface RegistrationData {
  email: string;
  phone?: string;
  password: string;
  promoCode?: string;
}

/**
 * Команды регистрации (бизнес-логика)
 * Объединяют несколько UI действий в сценарии
 */
export class RegistrationCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any,
    private readonly modalFactory: any
  ) {}

  /**
   * Полный сценарий регистрации по email
   */
  async registerWithEmail(email?: string, password?: string): Promise<void> {
    const header = this.pageFactory.createHeader();
    const registrationModal = this.modalFactory.createRegistrationModal();

    // Шаг 1: Открыть модальное окно регистрации
    await header.clickRegistration();
    await registrationModal.waitForLoad();

    // Шаг 2: Переключиться на таб регистрации
    await registrationModal.tabs.clickSignup();

    // Шаг 3: Заполнить форму
    await registrationModal.form.fillEmail(email || AuthTestData.registration.email);
    await registrationModal.form.fillPassword(password || AuthTestData.registration.password);

    // Шаг 4: Принять условия и отправить
    await registrationModal.form.acceptTerms();
    await registrationModal.form.submit();

    // Шаг 5: Проверить результат
    await this.verifyRegistrationAttempt();
  }

  /**
   * Регистрация со всеми данными
   */
  async registerWithFullData(data?: RegistrationData): Promise<void> {
    const registrationData = data || {
      email: AuthTestData.registration.email,
      phone: AuthTestData.registration.phone,
      password: AuthTestData.registration.password,
      promoCode: AuthTestData.registration.promoCode
    };

    const header = this.pageFactory.createHeader();
    const registrationModal = this.modalFactory.createRegistrationModal();

    await header.clickRegistration();
    await registrationModal.waitForLoad();
    await registrationModal.form.registerWithFullData(registrationData);

    await this.verifyRegistrationAttempt();
  }

  /**
   * Регистрация с невалидными данными
   */
  async registerWithInvalidData(): Promise<void> {
    await this.registerWithEmail(
      AuthTestData.invalid.invalidEmailFormat,
      AuthTestData.invalid.shortPassword
    );
  }

  /**
   * Переход к авторизации из формы регистрации
   */
  async switchToLogin(): Promise<void> {
    const registrationModal = this.modalFactory.createRegistrationModal();
    await registrationModal.navigation.goToLogin();
  }

  /**
   * Проверка попытки регистрации
   */
  private async verifyRegistrationAttempt(): Promise<void> {
    const registrationModal = this.modalFactory.createRegistrationModal();
    
    // Ждем либо успешной регистрации (модалка закрылась),
    // либо ошибки (модалка осталась открытой с ошибкой)
    await this.page.waitForTimeout(2000); // Даем время на обработку
    
    const isModalOpen = await registrationModal.isOpen();
    if (isModalOpen) {
      // Модалка открыта - проверяем наличие ошибки
      const hasError = await registrationModal.errors.isVisible();
      if (!hasError) {
        // Возможно, ждем SMS код
        const isSmsVisible = await registrationModal.sms.isVisible();
        expect(isSmsVisible || hasError).toBeTruthy();
      }
    }
    // Если модалка закрыта - регистрация успешна
  }

  /**
   * Очистка формы регистрации
   */
  async clearRegistrationForm(): Promise<void> {
    const registrationModal = this.modalFactory.createRegistrationModal();
    await registrationModal.form.clear();
  }
}
