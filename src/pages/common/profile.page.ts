/**
 * Profile Page - Page Object
 * Страница профиля пользователя с формой редактирования данных
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/abstract/base.page';
import { InputComponent } from '@components/atoms/input/input.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { BadgeComponent } from '@components/atoms/badge/badge.component';
import { ProfileTabsComponent } from '@components/organisms/profile-tabs/profile-tabs.component';
import { ProfileFormComponent } from '@components/organisms/profile-form/profile-form.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';
import { Routes } from '@config/routes';

export class ProfilePage extends BasePage {
  protected pageName = 'Profile Page';
  protected url = Routes.PROFILE;

  // ========== ЛОКАТОРЫ ==========

  // Заголовок страницы
  readonly pageTitle: Locator;

  // Карточка пользователя
  readonly userCard: Locator;
  readonly userAvatar: Locator;
  readonly userEmail: Locator;
  readonly userId: Locator;
  readonly userIdBadge: BadgeComponent;

  // Табы профиля
  readonly profileTabs: ProfileTabsComponent;

  // Форма профиля
  readonly profileForm: ProfileFormComponent;

  // Кнопка выхода
  readonly logoutButton: ButtonComponent;

  constructor(page: Page) {
    super(page, Routes.PROFILE, 'Profile Page');

    // Инициализация основных элементов
    this.pageTitle = page.locator('.container .row-card h3');
    this.userCard = page.locator('.card-user-profile');
    this.userAvatar = page.locator('.avatar-user-profile__image');
    this.userEmail = page.locator('.avatar-user-profile__title');
    this.userId = page.locator('.clipboard-value');
    this.userIdBadge = new BadgeComponent(
      page,
      page.locator('.badge.border-gray.body-min.clipboard'),
      'User ID Badge'
    );

    // Инициализация компонентов
    this.profileTabs = new ProfileTabsComponent(
      page,
      page.locator('.tabs.pl-lg.w-full')
    );

    this.profileForm = new ProfileFormComponent(
      page,
      page.locator('.card.flex-col.gap-sm.bg-gray-dark.p-lg.pt-0.round-lg')
    );

    this.logoutButton = new ButtonComponent(
      page,
      page.locator('button.btn-default.btn-danger'),
      'Logout Button'
    );
  }

  // ========== БАЗОВЫЕ МЕТОДЫ СТРАНИЦЫ ==========

  /**
   * Проверить, загружена ли страница профиля
   */
  async isLoaded(): Promise<boolean> {
    return await this.userCard.isVisible() &&
           await this.profileTabs.isLoaded() &&
           await this.profileForm.isLoaded();
  }

  /**
   * Дождаться загрузки страницы профиля
   */
  async waitForLoad(): Promise<void> {
    await super.waitForLoad();
    await this.userCard.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.profileTabs.waitForLoad();
    await this.profileForm.waitForLoad();
    logger.success('Страница профиля загружена');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить email пользователя
   */
  async getUserEmail(): Promise<string> {
    try {
      const email = await this.userEmail.textContent();
      logger.success(`Email пользователя: ${email}`);
      return email || '';
    } catch (error) {
      logger.error('Ошибка получения email пользователя', error as Error);
      return '';
    }
  }

  /**
   * Получить ID пользователя
   */
  async getUserId(): Promise<string> {
    try {
      const userId = await this.userId.textContent();
      logger.success(`ID пользователя: ${userId}`);
      return userId || '';
    } catch (error) {
      logger.error('Ошибка получения ID пользователя', error as Error);
      return '';
    }
  }

  /**
   * Получить URL аватара пользователя
   */
  async getAvatarUrl(): Promise<string> {
    try {
      const avatarUrl = await this.userAvatar.getAttribute('src');
      logger.success(`URL аватара: ${avatarUrl}`);
      return avatarUrl || '';
    } catch (error) {
      logger.error('Ошибка получения URL аватара', error as Error);
      return '';
    }
  }

  /**
   * Получить alt текст аватара
   */
  async getAvatarAlt(): Promise<string> {
    try {
      const altText = await this.userAvatar.getAttribute('alt');
      logger.success(`Alt текст аватара: ${altText}`);
      return altText || '';
    } catch (error) {
      logger.error('Ошибка получения alt текста аватара', error as Error);
      return '';
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С ТАБАМИ ==========

  /**
   * Переключиться на вкладку "Огляд"
   */
  async switchToOverviewTab(): Promise<void> {
    await this.profileTabs.selectTab('Огляд');
    logger.step('Переключено на вкладку "Огляд"');
  }

  /**
   * Переключиться на вкладку "Деталі користувача"
   */
  async switchToDetailsTab(): Promise<void> {
    await this.profileTabs.selectTab('Деталі користувача');
    logger.step('Переключено на вкладку "Деталі користувача"');
  }

  /**
   * Переключиться на вкладку "Безпека"
   */
  async switchToSecurityTab(): Promise<void> {
    await this.profileTabs.selectTab('Безпека');
    logger.step('Переключено на вкладку "Безпека"');
  }

  /**
   * Переключиться на вкладку "Верифікація"
   */
  async switchToVerificationTab(): Promise<void> {
    await this.profileTabs.selectTab('Верифікація');
    logger.step('Переключено на вкладку "Верифікація"');
  }

  /**
   * Получить название активной вкладки
   */
  async getActiveTabName(): Promise<string> {
    return await this.profileTabs.getActiveTabName();
  }

  // ========== МЕТОДЫ РАБОТЫ С ФОРМОЙ ==========

  /**
   * Заполнить имя пользователя
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.profileForm.fillFirstName(firstName);
    logger.step(`Заполнено имя: ${firstName}`);
  }

  /**
   * Заполнить фамилию пользователя
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.profileForm.fillLastName(lastName);
    logger.step(`Заполнена фамилия: ${lastName}`);
  }

  /**
   * Заполнить email пользователя
   */
  async fillEmail(email: string): Promise<void> {
    await this.profileForm.fillEmail(email);
    logger.step(`Заполнен email: ${email}`);
  }

  /**
   * Подтвердить email
   */
  async confirmEmail(): Promise<void> {
    await this.profileForm.confirmEmail();
    logger.step('Email подтвержден');
  }

  /**
   * Выбрать страну
   */
  async selectCountry(countryCode: string): Promise<void> {
    await this.profileForm.selectCountry(countryCode);
    logger.step(`Выбрана страна: ${countryCode}`);
  }

  /**
   * Заполнить дату рождения
   */
  async fillBirthDate(date: string): Promise<void> {
    await this.profileForm.fillBirthDate(date);
    logger.step(`Заполнена дата рождения: ${date}`);
  }

  /**
   * Выбрать пол
   */
  async selectGender(gender: 'm' | 'f'): Promise<void> {
    await this.profileForm.selectGender(gender);
    logger.step(`Выбран пол: ${gender}`);
  }

  /**
   * Заполнить номер телефона
   */
  async fillPhone(phone: string): Promise<void> {
    await this.profileForm.fillPhone(phone);
    logger.step(`Заполнен номер телефона: ${phone}`);
  }

  /**
   * Сохранить изменения
   */
  async saveChanges(): Promise<void> {
    await this.profileForm.saveChanges();
    logger.step('Изменения сохранены');
  }

  // ========== МЕТОДЫ РАБОТЫ С КНОПКАМИ ==========

  /**
   * Выйти из системы
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.success('Пользователь вышел из системы');
  }

  /**
   * Скопировать ID пользователя
   */
  async copyUserId(): Promise<void> {
    await this.userIdBadge.click();
    logger.step('ID пользователя скопирован');
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что страница полностью загружена
   */
  async isPageFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasUserCard = await this.userCard.isVisible();
      const hasTabs = await this.profileTabs.isLoaded();
      const hasForm = await this.profileForm.isLoaded();
      
      return isLoaded && hasUserCard && hasTabs && hasForm;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что аватар загружен
   */
  async isAvatarLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.userAvatar.isVisible();
      const hasSrc = await this.getAvatarUrl() !== '';
      return isVisible && hasSrc;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что форма готова к редактированию
   */
  async isFormReady(): Promise<boolean> {
    return await this.profileForm.isFormReady();
  }

  /**
   * Проверить, что кнопка выхода активна
   */
  async isLogoutButtonEnabled(): Promise<boolean> {
    try {
      return await this.logoutButton.isEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДАННЫХ ФОРМЫ ==========

  /**
   * Получить все данные формы
   */
  async getFormData(): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    birthDate: string;
    gender: string;
    phone: string;
  }> {
    return await this.profileForm.getFormData();
  }

  /**
   * Получить данные пользователя
   */
  async getUserData(): Promise<{
    email: string;
    userId: string;
    avatarUrl: string;
    avatarAlt: string;
  }> {
    const [email, userId, avatarUrl, avatarAlt] = await Promise.all([
      this.getUserEmail(),
      this.getUserId(),
      this.getAvatarUrl(),
      this.getAvatarAlt()
    ]);

    return {
      email,
      userId,
      avatarUrl,
      avatarAlt
    };
  }

  /**
   * Получить полную информацию о профиле
   */
  async getProfileInfo(): Promise<{
    userData: {
      email: string;
      userId: string;
      avatarUrl: string;
      avatarAlt: string;
    };
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      country: string;
      birthDate: string;
      gender: string;
      phone: string;
    };
    activeTab: string;
    isFormReady: boolean;
  }> {
    const [userData, formData, activeTab, isFormReady] = await Promise.all([
      this.getUserData(),
      this.getFormData(),
      this.getActiveTabName(),
      this.isFormReady()
    ]);

    return {
      userData,
      formData,
      activeTab,
      isFormReady
    };
  }
}
