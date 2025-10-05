/**
 * Bonus Card Component - Atom
 * Атомарный компонент карточки бонуса
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusCardComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Изображение карточки
  readonly cardImage: Locator;

  // Заголовок бонуса
  readonly title: Locator;

  // Описание бонуса
  readonly excerpt: Locator;

  // Кнопки
  readonly subscribeButton: ButtonComponent;
  readonly detailsButton: ButtonComponent;

  // Обертка кнопок
  readonly buttonWrapper: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Card') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.cardImage = root.locator('.card-image');
    this.title = root.locator('.title');
    this.excerpt = root.locator('.excerpt');
    this.buttonWrapper = root.locator('.button-wrapper');

    // Инициализация компонентов
    this.subscribeButton = new ButtonComponent(
      page,
      root.locator('button:has-text("Підписатися")'),
      'Subscribe Button'
    );

    this.detailsButton = new ButtonComponent(
      page,
      root.locator('button:has-text("Детальна інформація")'),
      'Details Button'
    );
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
      const hasTitle = await this.title.isVisible();
      const hasButtons = await this.buttonWrapper.isVisible();
      
      return isVisible && hasTitle && hasButtons;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.title.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Карточка бонуса загружена');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить название бонуса
   */
  @LogAction('Получение названия бонуса')
  @ValidateState()
  async getTitle(): Promise<string> {
    try {
      const title = await this.title.textContent();
      logger.success(`Название бонуса: ${title}`);
      return title || '';
    } catch (error) {
      logger.error('Ошибка получения названия бонуса', error as Error);
      return '';
    }
  }

  /**
   * Получить описание бонуса
   */
  @LogAction('Получение описания бонуса')
  @ValidateState()
  async getDescription(): Promise<string> {
    try {
      const description = await this.excerpt.textContent();
      logger.success(`Описание бонуса: ${description}`);
      return description || '';
    } catch (error) {
      logger.error('Ошибка получения описания бонуса', error as Error);
      return '';
    }
  }

  /**
   * Получить URL изображения
   */
  @LogAction('Получение URL изображения')
  @ValidateState()
  async getImageUrl(): Promise<string> {
    try {
      const imageSrc = await this.cardImage.getAttribute('src');
      logger.success(`URL изображения: ${imageSrc}`);
      return imageSrc || '';
    } catch (error) {
      logger.error('Ошибка получения URL изображения', error as Error);
      return '';
    }
  }

  /**
   * Получить alt текст изображения
   */
  @LogAction('Получение alt текста изображения')
  @ValidateState()
  async getImageAlt(): Promise<string> {
    try {
      const altText = await this.cardImage.getAttribute('alt');
      logger.success(`Alt текст изображения: ${altText}`);
      return altText || '';
    } catch (error) {
      logger.error('Ошибка получения alt текста', error as Error);
      return '';
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С КНОПКАМИ ==========

  /**
   * Подписаться на бонус
   */
  @LogAction('Подписка на бонус')
  @ValidateState()
  async subscribe(): Promise<void> {
    try {
      await this.subscribeButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
      logger.success('Подписка на бонус выполнена');
    } catch (error) {
      logger.error('Ошибка подписки на бонус', error as Error);
      throw error;
    }
  }

  /**
   * Открыть детальную информацию
   */
  @LogAction('Открытие детальной информации о бонусе')
  @ValidateState()
  async openDetails(): Promise<void> {
    try {
      await this.detailsButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
      logger.success('Детальная информация о бонусе открыта');
    } catch (error) {
      logger.error('Ошибка открытия детальной информации', error as Error);
      throw error;
    }
  }

  /**
   * Проверить, что кнопка подписки активна
   */
  @LogAction('Проверка активности кнопки подписки')
  async isSubscribeButtonEnabled(): Promise<boolean> {
    try {
      return await this.subscribeButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка детальной информации активна
   */
  @LogAction('Проверка активности кнопки детальной информации')
  async isDetailsButtonEnabled(): Promise<boolean> {
    try {
      return await this.detailsButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка подписки видна
   */
  @LogAction('Проверка видимости кнопки подписки')
  async isSubscribeButtonVisible(): Promise<boolean> {
    try {
      return await this.subscribeButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка детальной информации видна
   */
  @LogAction('Проверка видимости кнопки детальной информации')
  async isDetailsButtonVisible(): Promise<boolean> {
    try {
      return await this.detailsButton.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что карточка полностью загружена
   */
  @LogAction('Проверка полной загрузки карточки')
  async isCardFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasImage = await this.cardImage.isVisible();
      const hasTitle = await this.title.isVisible();
      const hasDescription = await this.excerpt.isVisible();
      const hasButtons = await this.buttonWrapper.isVisible();
      
      return isLoaded && hasImage && hasTitle && hasDescription && hasButtons;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что изображение загружено
   */
  @LogAction('Проверка загрузки изображения')
  async isImageLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.cardImage.isVisible();
      const hasSrc = await this.getImageUrl() !== '';
      return isVisible && hasSrc;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все кнопки активны
   */
  @LogAction('Проверка активности всех кнопок')
  async areAllButtonsEnabled(): Promise<boolean> {
    try {
      const subscribeEnabled = await this.isSubscribeButtonEnabled();
      const detailsEnabled = await this.isDetailsButtonEnabled();
      return subscribeEnabled && detailsEnabled;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все кнопки видимы
   */
  @LogAction('Проверка видимости всех кнопок')
  async areAllButtonsVisible(): Promise<boolean> {
    try {
      const subscribeVisible = await this.isSubscribeButtonVisible();
      const detailsVisible = await this.isDetailsButtonVisible();
      return subscribeVisible && detailsVisible;
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОИСКА ==========

  /**
   * Проверить, содержит ли карточка текст
   */
  @LogAction('Проверка содержания текста: {text}')
  async containsText(text: string): Promise<boolean> {
    try {
      const titleText = await this.getTitle();
      const descriptionText = await this.getDescription();
      
      return titleText.includes(text) || descriptionText.includes(text);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что название содержит текст
   */
  @LogAction('Проверка содержания текста в названии: {text}')
  async titleContainsText(text: string): Promise<boolean> {
    try {
      const titleText = await this.getTitle();
      return titleText.includes(text);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что описание содержит текст
   */
  @LogAction('Проверка содержания текста в описании: {text}')
  async descriptionContainsText(text: string): Promise<boolean> {
    try {
      const descriptionText = await this.getDescription();
      return descriptionText.includes(text);
    } catch {
      return false;
    }
  }
}
