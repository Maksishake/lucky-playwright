/**
 * Profile Form Component - Organism
 * Компонент формы профиля пользователя
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { InputComponent } from '@components/atoms/input/input.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class ProfileFormComponent extends BaseComponent {
  // ========== ЛОКАТОРЫ ==========

  // Заголовок формы
  readonly formTitle: Locator;

  // Поля формы
  readonly firstNameInput: InputComponent;
  readonly lastNameInput: InputComponent;
  readonly emailInput: InputComponent;
  readonly countrySelect: Locator;
  readonly currencyInput: InputComponent;
  readonly birthDateInput: InputComponent;
  readonly genderSelect: Locator;
  readonly phoneInput: InputComponent;

  // Кнопки
  readonly confirmEmailButton: ButtonComponent;
  readonly saveButton: ButtonComponent;

  // Выпадающие списки
  readonly countryDropdown: Locator;
  readonly genderDropdown: Locator;

  // Сообщения об ошибках
  readonly emailError: Locator;
  readonly phoneError: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Profile Form') {
    super(page, root, componentName);

    // Инициализация заголовка
    this.formTitle = root.locator('.slider-title');

    // Инициализация полей формы
    this.firstNameInput = new InputComponent(
      page,
      root.locator('input[wire:model="firstName"]'),
      'First Name Input'
    );

    this.lastNameInput = new InputComponent(
      page,
      root.locator('input[wire:model="lastName"]'),
      'Last Name Input'
    );

    this.emailInput = new InputComponent(
      page,
      root.locator('input[wire:model="email"]'),
      'Email Input'
    );

    this.countrySelect = root.locator('.form-select[wire\\:click="toggleCountries"]');
    this.currencyInput = new InputComponent(
      page,
      root.locator('input[placeholder="UAH"]'),
      'Currency Input'
    );

    this.birthDateInput = new InputComponent(
      page,
      root.locator('input.date-picker'),
      'Birth Date Input'
    );

    this.genderSelect = root.locator('.form-select[wire\\:click="toggleGenders"]');
    this.phoneInput = new InputComponent(
      page,
      root.locator('input[wire:model="phone"]'),
      'Phone Input'
    );

    // Инициализация кнопок
    this.confirmEmailButton = new ButtonComponent(
      page,
      root.locator('button[wire:click="sendEmailVerification"]'),
      'Confirm Email Button'
    );

    this.saveButton = new ButtonComponent(
      page,
      root.locator('button[wire:click="save"]'),
      'Save Button'
    );

    // Инициализация выпадающих списков
    this.countryDropdown = root.locator('.form-select-dropdown');
    this.genderDropdown = root.locator('.form-select-dropdown');

    // Инициализация сообщений об ошибках
    this.emailError = root.locator('.error-text:has-text("Email не підтверджено")');
    this.phoneError = root.locator('.error-text:has-text("Телефон не підтверджено")');
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

  /**
   * Проверить загрузку компонента
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.isVisible();
      const hasTitle = await this.formTitle.isVisible();
      const hasFirstName = await this.firstNameInput.isVisible();
      const hasLastName = await this.lastNameInput.isVisible();
      const hasEmail = await this.emailInput.isVisible();
      
      return isVisible && hasTitle && hasFirstName && hasLastName && hasEmail;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.formTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.firstNameInput.waitForLoad();
    await this.lastNameInput.waitForLoad();
    await this.emailInput.waitForLoad();
    logger.success('Форма профиля загружена');
  }

  // ========== МЕТОДЫ ЗАПОЛНЕНИЯ ФОРМЫ ==========

  /**
   * Заполнить имя
   * @param firstName Имя
   */
  @LogAction('Заполнение имени: {firstName}')
  @ValidateState()
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    logger.success(`Имя заполнено: ${firstName}`);
  }

  /**
   * Заполнить фамилию
   * @param lastName Фамилия
   */
  @LogAction('Заполнение фамилии: {lastName}')
  @ValidateState()
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
    logger.success(`Фамилия заполнена: ${lastName}`);
  }

  /**
   * Заполнить email
   * @param email Email
   */
  @LogAction('Заполнение email: {email}')
  @ValidateState()
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    logger.success(`Email заполнен: ${email}`);
  }

  /**
   * Заполнить дату рождения
   * @param date Дата рождения
   */
  @LogAction('Заполнение даты рождения: {date}')
  @ValidateState()
  async fillBirthDate(date: string): Promise<void> {
    await this.birthDateInput.fill(date);
    logger.success(`Дата рождения заполнена: ${date}`);
  }

  /**
   * Заполнить номер телефона
   * @param phone Номер телефона
   */
  @LogAction('Заполнение номера телефона: {phone}')
  @ValidateState()
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
    logger.success(`Номер телефона заполнен: ${phone}`);
  }

  // ========== МЕТОДЫ РАБОТЫ С ВЫПАДАЮЩИМИ СПИСКАМИ ==========

  /**
   * Открыть выпадающий список стран
   */
  @LogAction('Открытие выпадающего списка стран')
  @ValidateState()
  async openCountryDropdown(): Promise<void> {
    await this.countrySelect.click();
    await this.countryDropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Выпадающий список стран открыт');
  }

  /**
   * Выбрать страну
   * @param countryCode Код страны
   */
  @LogAction('Выбор страны: {countryCode}')
  @ValidateState()
  async selectCountry(countryCode: string): Promise<void> {
    await this.openCountryDropdown();
    const countryOption = this.countryDropdown.locator(`li[wire:click="setCountry('${countryCode}')"]`);
    await countryOption.click();
    await this.countryDropdown.waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT });
    logger.success(`Страна выбрана: ${countryCode}`);
  }

  /**
   * Открыть выпадающий список полов
   */
  @LogAction('Открытие выпадающего списка полов')
  @ValidateState()
  async openGenderDropdown(): Promise<void> {
    await this.genderSelect.click();
    await this.genderDropdown.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Выпадающий список полов открыт');
  }

  /**
   * Выбрать пол
   * @param gender Пол ('m' или 'f')
   */
  @LogAction('Выбор пола: {gender}')
  @ValidateState()
  async selectGender(gender: 'm' | 'f'): Promise<void> {
    await this.openGenderDropdown();
    const genderOption = this.genderDropdown.locator(`li[wire:click="setGender('${gender}')"]`);
    await genderOption.click();
    await this.genderDropdown.waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT });
    logger.success(`Пол выбран: ${gender}`);
  }

  // ========== МЕТОДЫ РАБОТЫ С КНОПКАМИ ==========

  /**
   * Подтвердить email
   */
  @LogAction('Подтверждение email')
  @ValidateState()
  async confirmEmail(): Promise<void> {
    await this.confirmEmailButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.success('Email подтвержден');
  }

  /**
   * Сохранить изменения
   */
  @LogAction('Сохранение изменений')
  @ValidateState()
  async saveChanges(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.success('Изменения сохранены');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДАННЫХ ==========

  /**
   * Получить значение имени
   */
  @LogAction('Получение значения имени')
  async getFirstName(): Promise<string> {
    return await this.firstNameInput.getValue();
  }

  /**
   * Получить значение фамилии
   */
  @LogAction('Получение значения фамилии')
  async getLastName(): Promise<string> {
    return await this.lastNameInput.getValue();
  }

  /**
   * Получить значение email
   */
  @LogAction('Получение значения email')
  async getEmail(): Promise<string> {
    return await this.emailInput.getValue();
  }

  /**
   * Получить значение даты рождения
   */
  @LogAction('Получение значения даты рождения')
  async getBirthDate(): Promise<string> {
    return await this.birthDateInput.getValue();
  }

  /**
   * Получить значение номера телефона
   */
  @LogAction('Получение значения номера телефона')
  async getPhone(): Promise<string> {
    return await this.phoneInput.getValue();
  }

  /**
   * Получить все данные формы
   */
  @LogAction('Получение всех данных формы')
  async getFormData(): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    birthDate: string;
    gender: string;
    phone: string;
  }> {
    const [firstName, lastName, email, birthDate, phone] = await Promise.all([
      this.getFirstName(),
      this.getLastName(),
      this.getEmail(),
      this.getBirthDate(),
      this.getPhone()
    ]);

    // Получаем выбранную страну и пол
    const country = await this.getSelectedCountry();
    const gender = await this.getSelectedGender();

    return {
      firstName,
      lastName,
      email,
      country,
      birthDate,
      gender,
      phone
    };
  }

  /**
   * Получить выбранную страну
   */
  @LogAction('Получение выбранной страны')
  async getSelectedCountry(): Promise<string> {
    try {
      const countryText = await this.countrySelect.textContent();
      return countryText || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить выбранный пол
   */
  @LogAction('Получение выбранного пола')
  async getSelectedGender(): Promise<string> {
    try {
      const genderText = await this.genderSelect.textContent();
      return genderText || '';
    } catch {
      return '';
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что форма готова к редактированию
   */
  @LogAction('Проверка готовности формы к редактированию')
  async isFormReady(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasFirstName = await this.firstNameInput.isVisible();
      const hasLastName = await this.lastNameInput.isVisible();
      const hasEmail = await this.emailInput.isVisible();
      const hasSaveButton = await this.saveButton.isVisible();
      
      return isLoaded && hasFirstName && hasLastName && hasEmail && hasSaveButton;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка сохранения активна
   */
  @LogAction('Проверка активности кнопки сохранения')
  async isSaveButtonEnabled(): Promise<boolean> {
    try {
      return await this.saveButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка подтверждения email активна
   */
  @LogAction('Проверка активности кнопки подтверждения email')
  async isConfirmEmailButtonEnabled(): Promise<boolean> {
    try {
      return await this.confirmEmailButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить наличие ошибки email
   */
  @LogAction('Проверка наличия ошибки email')
  async hasEmailError(): Promise<boolean> {
    try {
      return await this.emailError.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить наличие ошибки телефона
   */
  @LogAction('Проверка наличия ошибки телефона')
  async hasPhoneError(): Promise<boolean> {
    try {
      return await this.phoneError.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что выпадающий список стран открыт
   */
  @LogAction('Проверка открытия выпадающего списка стран')
  async isCountryDropdownOpen(): Promise<boolean> {
    try {
      return await this.countryDropdown.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что выпадающий список полов открыт
   */
  @LogAction('Проверка открытия выпадающего списка полов')
  async isGenderDropdownOpen(): Promise<boolean> {
    try {
      return await this.genderDropdown.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что все обязательные поля заполнены
   */
  @LogAction('Проверка заполнения обязательных полей')
  async areRequiredFieldsFilled(): Promise<boolean> {
    try {
      const [firstName, lastName, email] = await Promise.all([
        this.getFirstName(),
        this.getLastName(),
        this.getEmail()
      ]);

      return firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '';
    } catch {
      return false;
    }
  }

  /**
   * Проверить валидность email
   */
  @LogAction('Проверка валидности email')
  async isEmailValid(): Promise<boolean> {
    try {
      const email = await this.getEmail();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    } catch {
      return false;
    }
  }

  /**
   * Проверить валидность номера телефона
   */
  @LogAction('Проверка валидности номера телефона')
  async isPhoneValid(): Promise<boolean> {
    try {
      const phone = await this.getPhone();
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      return phoneRegex.test(phone);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что форма готова к сохранению
   */
  @LogAction('Проверка готовности формы к сохранению')
  async isFormReadyToSave(): Promise<boolean> {
    try {
      const areFieldsFilled = await this.areRequiredFieldsFilled();
      const isEmailValid = await this.isEmailValid();
      const isPhoneValid = await this.isPhoneValid();
      const isSaveButtonEnabled = await this.isSaveButtonEnabled();
      
      return areFieldsFilled && isEmailValid && isPhoneValid && isSaveButtonEnabled;
    } catch {
      return false;
    }
  }
}
