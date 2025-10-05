/**
 * User Profile Card Component - Molecule
 * Компонент карточки пользователя с аватаром, email и ID
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { BadgeComponent } from '@components/atoms/badge/badge.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class UserProfileCardComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
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

  // Аватар пользователя
  readonly userAvatar: Locator;

  // Email пользователя
  readonly userEmail: Locator;

  // ID пользователя (бейдж)
  readonly userIdBadge: BadgeComponent;

  // Кнопка копирования ID
  readonly copyIdButton: IconComponent;

  constructor(page: Page, root: Locator, componentName: string = 'User Profile Card') {
    super(page, root, componentName);

    // Инициализация элементов
    this.userAvatar = root.locator('.icon-4xl');
    this.userEmail = root.locator('.text-white.h4');
    this.userIdBadge = new BadgeComponent(
      page,
      root.locator('.badge.clipboard'),
      'User ID Badge'
    );
    this.copyIdButton = new IconComponent(
      page,
      root.locator('.clipboard-icon'),
      'Copy ID Button'
    );
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить загрузку карточки пользователя
   */
  @LogAction('Проверка загрузки карточки пользователя')
  @ValidateState()
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.root.isVisible();
      const hasAvatar = await this.userAvatar.isVisible();
      const hasEmail = await this.userEmail.isVisible();
      const hasBadge = await this.userIdBadge.isLoaded();
      
      return isVisible && hasAvatar && hasEmail && hasBadge;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки карточки пользователя
   */
  @LogAction('Ожидание загрузки карточки пользователя')
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.userAvatar.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.userEmail.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.userIdBadge.waitForLoad();
    logger.success('Карточка пользователя загружена');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить URL аватара пользователя
   */
  @LogAction('Получение URL аватара пользователя')
  @ValidateState()
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
  @LogAction('Получение alt текста аватара')
  @ValidateState()
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

  /**
   * Получить email пользователя
   */
  @LogAction('Получение email пользователя')
  @ValidateState()
  async getEmail(): Promise<string> {
    try {
      const email = await this.userEmail.textContent();
      logger.success(`Email пользователя: ${email}`);
      return email?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения email пользователя', error as Error);
      return '';
    }
  }

  /**
   * Получить ID пользователя
   */
  @LogAction('Получение ID пользователя')
  @ValidateState()
  async getUserId(): Promise<string> {
    try {
      const userId = await this.userIdBadge.getText();
      logger.success(`ID пользователя: ${userId}`);
      return userId || '';
    } catch (error) {
      logger.error('Ошибка получения ID пользователя', error as Error);
      return '';
    }
  }

  /**
   * Получить полную информацию о пользователе
   */
  @LogAction('Получение полной информации о пользователе')
  @ValidateState()
  async getUserInfo(): Promise<{
    email: string;
    userId: string;
    avatarUrl: string;
    avatarAlt: string;
  }> {
    const [email, userId, avatarUrl, avatarAlt] = await Promise.all([
      this.getEmail(),
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

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Скопировать ID пользователя
   */
  @LogAction('Копирование ID пользователя')
  @ValidateState()
  async copyUserId(): Promise<void> {
    try {
      await this.copyIdButton.click();
      await this.page.waitForTimeout(500); // Небольшая задержка для копирования
      logger.success('ID пользователя скопирован');
    } catch (error) {
      logger.error('Ошибка копирования ID пользователя', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по аватару пользователя
   */
  @LogAction('Клик по аватару пользователя')
  @ValidateState()
  async clickAvatar(): Promise<void> {
    try {
      await this.userAvatar.click();
      logger.success('Клик по аватару пользователя выполнен');
    } catch (error) {
      logger.error('Ошибка клика по аватару пользователя', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по email пользователя
   */
  @LogAction('Клик по email пользователя')
  @ValidateState()
  async clickEmail(): Promise<void> {
    try {
      await this.userEmail.click();
      logger.success('Клик по email пользователя выполнен');
    } catch (error) {
      logger.error('Ошибка клика по email пользователя', error as Error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что аватар загружен
   */
  @LogAction('Проверка загрузки аватара')
  async isAvatarLoaded(): Promise<boolean> {
    try {
      return await this.userAvatar.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что email отображается
   */
  @LogAction('Проверка отображения email')
  async isEmailVisible(): Promise<boolean> {
    try {
      return await this.userEmail.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что ID пользователя отображается
   */
  @LogAction('Проверка отображения ID пользователя')
  async isUserIdVisible(): Promise<boolean> {
    try {
      return await this.userIdBadge.isLoaded();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка копирования активна
   */
  @LogAction('Проверка активности кнопки копирования')
  async isCopyButtonEnabled(): Promise<boolean> {
    try {
      return await this.copyIdButton.isEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что email валидный
   */
  @LogAction('Проверка валидности email')
  async isEmailValid(): Promise<boolean> {
    try {
      const email = await this.getEmail();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      logger.success(`Email валидный: ${isValid}`);
      return isValid;
    } catch (error) {
      logger.error('Ошибка проверки валидности email', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что ID пользователя не пустой
   */
  @LogAction('Проверка наличия ID пользователя')
  async hasUserId(): Promise<boolean> {
    try {
      const userId = await this.getUserId();
      const hasId = userId.length > 0;
      logger.success(`ID пользователя присутствует: ${hasId}`);
      return hasId;
    } catch (error) {
      logger.error('Ошибка проверки наличия ID пользователя', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что аватар загружен корректно
   */
  @LogAction('Проверка корректности загрузки аватара')
  async isAvatarLoadedCorrectly(): Promise<boolean> {
    try {
      const avatarUrl = await this.getAvatarUrl();
      const hasUrl = avatarUrl.length > 0;
      const isVisible = await this.isAvatarLoaded();
      const isCorrect = hasUrl && isVisible;
      logger.success(`Аватар загружен корректно: ${isCorrect}`);
      return isCorrect;
    } catch (error) {
      logger.error('Ошибка проверки корректности загрузки аватара', error as Error);
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить размер аватара
   */
  @LogAction('Получение размера аватара')
  @ValidateState()
  async getAvatarSize(): Promise<{ width: number; height: number }> {
    try {
      const boundingBox = await this.userAvatar.boundingBox();
      if (boundingBox) {
        logger.success(`Размер аватара: ${boundingBox.width}x${boundingBox.height}`);
        return {
          width: boundingBox.width,
          height: boundingBox.height
        };
      }
      return { width: 0, height: 0 };
    } catch (error) {
      logger.error('Ошибка получения размера аватара', error as Error);
      return { width: 0, height: 0 };
    }
  }

  /**
   * Получить стили аватара
   */
  @LogAction('Получение стилей аватара')
  @ValidateState()
  async getAvatarStyles(): Promise<{
    borderRadius: string;
    objectFit: string;
    maxHeight: string;
  }> {
    try {
      const styles = await this.userAvatar.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return {
          borderRadius: computedStyle.borderRadius,
          objectFit: computedStyle.objectFit,
          maxHeight: computedStyle.maxHeight
        };
      });
      logger.success('Стили аватара получены');
      return styles;
    } catch (error) {
      logger.error('Ошибка получения стилей аватара', error as Error);
      return {
        borderRadius: '',
        objectFit: '',
        maxHeight: ''
      };
    }
  }
}
