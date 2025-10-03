import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Интерфейс для данных регистрации
 */
export interface RegistrationData {
  email: string;
  phone?: string;
  password: string;
  promoCode?: string;
}

/**
 * Page Object для модального окна регистрации
 */
export class RegistrationModal extends BaseModal {
  // ========== ЛОКАТОРЫ ==========

  private readonly modal: Locator;
  private readonly closeButton: Locator;
  private readonly tabSignup: Locator;
  private readonly tabLogin: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly promoInput: Locator;
  private readonly checkbox: Locator;
  private readonly signupButton: Locator;
  private readonly countryDropdown: Locator;
  private readonly countryOptionUA: Locator;
  private readonly currencyDropdown: Locator;
  private readonly currencyOptionUAH: Locator;
  private readonly smsCodeInput: Locator;
  private readonly confirmButton: Locator;
  private readonly resendButton: Locator;
  private readonly googleLink: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Инициализация локаторов
    this.modal = page.locator('#modal-auth');
    this.closeButton = page.locator('#modal-auth .modal-close');
    this.tabSignup = page.locator('#modal-auth .tab-item[data-tab="tab-signup"]');
    this.tabLogin = page.locator('#modal-auth .tab-item[data-tab="tab-login"]');
    this.emailInput = page.locator('#modal-auth #email');
    this.phoneInput = page.locator('#modal-auth #phone-signup');
    this.passwordInput = page.locator('#modal-auth #password-signup');
    this.promoInput = page.locator('#modal-auth #promocode');
    this.checkbox = page.locator('#modal-auth #condition');
    this.signupButton = page.locator('#modal-auth #submit-btn');
    this.countryDropdown = page.locator('#modal-auth .toggle-phone .form-select button');
    this.countryOptionUA = page.locator('#modal-auth .form-select-options li:has-text("38")');
    this.currencyDropdown = page.locator('#modal-auth .form-group.form-select:has-text("Ігрова валюта") button');
    this.currencyOptionUAH = page.locator('#modal-auth .form-select-options li:has-text("UAH")');
    this.smsCodeInput = page.locator('#modal-auth #sms-code');
    this.confirmButton = page.locator('#modal-auth button:has-text("Sign up")');
    this.resendButton = page.locator('#modal-auth span:has-text("Resend the code")');
    this.googleLink = page.locator('#modal-auth a.social-link[href*="google"]');
    this.errorMessage = page.locator('#modal-auth .error-message');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ И СОСТОЯНИЯ ==========

  async isLoaded(): Promise<boolean> {
    return await this.modal.isVisible().catch(() => false);
  }

  async waitForLoad(): Promise<void> {
    await expect(this.modal).toBeVisible({ timeout: 10000 });
  }

  async isOpen(): Promise<boolean> {
    return await this.isLoaded();
  }

  async open(): Promise<void> {
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.modal).toBeHidden({ timeout: 5000 });
  }

  // ========== ГРУППИРОВАННЫЕ МЕТОДЫ ==========

  /**
   * Методы для работы с формой регистрации
   */
  form = {
    /** Заполнить email */
    fillEmail: async (email: string): Promise<void> => {
      await this.emailInput.fill(email);
    },

    /** Заполнить телефон */
    fillPhone: async (phone: string): Promise<void> => {
      await this.phoneInput.fill(phone);
    },

    /** Заполнить пароль */
    fillPassword: async (password: string): Promise<void> => {
      await this.passwordInput.fill(password);
    },

    /** Заполнить промокод */
    fillPromoCode: async (promoCode: string): Promise<void> => {
      await this.promoInput.fill(promoCode);
    },

    /** Принять условия (чекбокс) */
    acceptTerms: async (): Promise<void> => {
      if (!(await this.checkbox.isChecked())) {
        await this.checkbox.check();
      }
    },

    /** Очистить все поля */
    clear: async (): Promise<void> => {
      await this.emailInput.clear();
      await this.phoneInput.clear();
      await this.passwordInput.clear();
      await this.promoInput.clear();
    },

    /** Отправить форму */
    submit: async (): Promise<void> => {
      await this.form.acceptTerms();
      await this.signupButton.click();
    },

    /** Зарегистрироваться с email и паролем */
    registerWithEmail: async (email: string, password: string): Promise<void> => {
      await this.waitForLoad();
      await this.form.fillEmail(email);
      await this.form.fillPassword(password);
      await this.form.submit();
    },

    /** Зарегистрироваться с телефоном и паролем */
    registerWithPhone: async (phone: string, password: string): Promise<void> => {
      await this.waitForLoad();
      await this.form.fillPhone(phone);
      await this.form.fillPassword(password);
      await this.form.submit();
    },

    /** Зарегистрироваться со всеми данными */
    registerWithFullData: async (data: RegistrationData): Promise<void> => {
      await this.waitForLoad();
      await this.form.fillEmail(data.email);
      if (data.phone) await this.form.fillPhone(data.phone);
      await this.form.fillPassword(data.password);
      if (data.promoCode) await this.form.fillPromoCode(data.promoCode);
      await this.form.submit();
    },

    /** Проверить, отмечен ли чекбокс */
    isTermsAccepted: async (): Promise<boolean> => {
      return await this.checkbox.isChecked().catch(() => false);
    },
  };

  /**
   * Методы для работы с табами
   */
  tabs = {
    /** Переключиться на таб регистрации */
    clickSignup: async (): Promise<void> => {
      await this.tabSignup.click();
    },

    /** Переключиться на таб входа */
    clickLogin: async (): Promise<void> => {
      await this.tabLogin.click();
    },

    /** Проверить, активен ли таб регистрации */
    isSignupActive: async (): Promise<boolean> => {
      const classList = await this.tabSignup.getAttribute('class');
      return classList?.includes('active') || false;
    },
  };

  /**
   * Методы для работы с настройками (страна, валюта)
   */
  settings = {
    /** Выбрать страну - Украина */
    selectCountryUA: async (): Promise<void> => {
      await this.countryDropdown.click();
      await this.countryOptionUA.click();
    },

    /** Выбрать валюту - UAH */
    selectCurrencyUAH: async (): Promise<void> => {
      await this.currencyDropdown.click();
      await this.currencyOptionUAH.click();
    },
  };

  /**
   * Методы для работы с СМС-кодом
   */
  sms = {
    /** Заполнить СМС-код */
    fillCode: async (code: string): Promise<void> => {
      await this.smsCodeInput.fill(code);
    },

    /** Подтвердить СМС-код */
    confirm: async (): Promise<void> => {
      await this.confirmButton.click();
    },

    /** Отправить код заново */
    resend: async (): Promise<void> => {
      await this.resendButton.click();
    },

    /** Проверить видимость поля СМС-кода */
    isVisible: async (): Promise<boolean> => {
      return await this.smsCodeInput.isVisible().catch(() => false);
    },
  };

  /**
   * Методы для навигации
   */
  navigation = {
    /** Перейти к входу */
    goToLogin: async (): Promise<void> => {
      await this.tabLogin.click();
    },

    /** Закрыть модальное окно */
    close: async (): Promise<void> => {
      await this.close();
    },
  };

  /**
   * Методы для социальных сетей
   */
  social = {
    /** Зарегистрироваться через Google */
    registerWithGoogle: async (): Promise<void> => {
      await this.googleLink.click();
    },
  };

  /**
   * Методы для работы с ошибками
   */
  errors = {
    /** Получить текст первой ошибки */
    getText: async (): Promise<string> => {
      return await this.errorMessage.first().innerText();
    },

    /** Получить все тексты ошибок */
    getAllTexts: async (): Promise<string[]> => {
      return await this.errorMessage.allInnerTexts();
    },

    /** Проверить видимость ошибки */
    isVisible: async (): Promise<boolean> => {
      return await this.errorMessage.isVisible().catch(() => false);
    },

    /** Проверить наличие любой ошибки */
    expectAny: async (): Promise<void> => {
      await expect(this.errorMessage).toBeVisible();
      await expect(this.errorMessage).toHaveText(/.+/);
    },

    /** Проверить наличие ошибки с текстом */
    expectContains: async (text: string | RegExp): Promise<void> => {
      await expect(this.errorMessage).toContainText(text);
    },
  };

}
