/**
 * Bonus Cards Section Component - Organism
 * Компонент секции с карточками бонусов
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusCardsSectionComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Все карточки бонусов
  readonly bonusCards: Locator;

  // Карточки по типам
  readonly depositCards: Locator;
  readonly cashbackCards: Locator;
  readonly giftCards: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Cards Section') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.bonusCards = root.locator('.card.card-promotion');
    this.depositCards = root.locator('.card.card-promotion');
    this.cashbackCards = root.locator('.card.card-promotion');
    this.giftCards = root.locator('.card.card-promotion');
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
      const hasCards = await this.bonusCards.count() > 0;
      
      return isVisible && hasCards;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.bonusCards.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Секция карточек бонусов загружена');
  }

  // ========== МЕТОДЫ РАБОТЫ С КАРТОЧКАМИ ==========

  /**
   * Получить все карточки бонусов
   */
  @LogAction('Получение всех карточек бонусов')
  @ValidateState()
  async getAllBonusCards(): Promise<Locator[]> {
    try {
      const cards = await this.bonusCards.all();
      logger.success(`Найдено карточек бонусов: ${cards.length}`);
      return cards;
    } catch (error) {
      logger.error('Ошибка получения карточек бонусов', error as Error);
      return [];
    }
  }

  /**
   * Получить карточку бонуса по названию
   */
  @LogAction('Получение карточки бонуса по названию: {title}')
  @ValidateState()
  async getBonusCardByTitle(title: string): Promise<Locator | null> {
    try {
      const card = this.bonusCards.filter({ hasText: title }).first();
      if (await card.isVisible({ timeout: TIMEOUTS.SHORT })) {
        logger.success(`Карточка бонуса найдена: ${title}`);
        return card;
      }
      logger.warning(`Карточка бонуса не найдена: ${title}`);
      return null;
    } catch (error) {
      logger.error(`Ошибка поиска карточки бонуса: ${title}`, error as Error);
      return null;
    }
  }

  /**
   * Получить карточку бонуса по индексу
   */
  @LogAction('Получение карточки бонуса по индексу: {index}')
  @ValidateState()
  async getBonusCardByIndex(index: number): Promise<Locator | null> {
    try {
      const card = this.bonusCards.nth(index);
      if (await card.isVisible({ timeout: TIMEOUTS.SHORT })) {
        logger.success(`Карточка бонуса по индексу ${index} найдена`);
        return card;
      }
      logger.warning(`Карточка бонуса по индексу ${index} не найдена`);
      return null;
    } catch (error) {
      logger.error(`Ошибка получения карточки бонуса по индексу ${index}`, error as Error);
      return null;
    }
  }

  /**
   * Получить количество карточек бонусов
   */
  @LogAction('Получение количества карточек бонусов')
  async getBonusCardsCount(): Promise<number> {
    try {
      const count = await this.bonusCards.count();
      logger.success(`Количество карточек бонусов: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества карточек', error as Error);
      return 0;
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С КНОПКАМИ ==========

  /**
   * Подписаться на бонус по названию
   */
  @LogAction('Подписка на бонус: {title}')
  @ValidateState()
  async subscribeToBonus(title: string): Promise<void> {
    try {
      const card = await this.getBonusCardByTitle(title);
      if (card) {
        const subscribeButton = card.locator('button:has-text("Підписатися")');
        await subscribeButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
        logger.success(`Подписка на бонус выполнена: ${title}`);
      } else {
        throw new Error(`Карточка бонуса не найдена: ${title}`);
      }
    } catch (error) {
      logger.error(`Ошибка подписки на бонус: ${title}`, error as Error);
      throw error;
    }
  }

  /**
   * Открыть детальную информацию о бонусе
   */
  @LogAction('Открытие детальной информации о бонусе: {title}')
  @ValidateState()
  async openBonusDetails(title: string): Promise<void> {
    try {
      const card = await this.getBonusCardByTitle(title);
      if (card) {
        const detailsButton = card.locator('button:has-text("Детальна інформація")');
        await detailsButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
        logger.success(`Детальная информация о бонусе открыта: ${title}`);
      } else {
        throw new Error(`Карточка бонуса не найдена: ${title}`);
      }
    } catch (error) {
      logger.error(`Ошибка открытия детальной информации: ${title}`, error as Error);
      throw error;
    }
  }

  /**
   * Подписаться на бонус по индексу
   */
  @LogAction('Подписка на бонус по индексу: {index}')
  @ValidateState()
  async subscribeToBonusByIndex(index: number): Promise<void> {
    try {
      const card = await this.getBonusCardByIndex(index);
      if (card) {
        const subscribeButton = card.locator('button:has-text("Підписатися")');
        await subscribeButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
        logger.success(`Подписка на бонус по индексу ${index} выполнена`);
      } else {
        throw new Error(`Карточка бонуса по индексу ${index} не найдена`);
      }
    } catch (error) {
      logger.error(`Ошибка подписки на бонус по индексу ${index}`, error as Error);
      throw error;
    }
  }

  /**
   * Открыть детальную информацию о бонусе по индексу
   */
  @LogAction('Открытие детальной информации о бонусе по индексу: {index}')
  @ValidateState()
  async openBonusDetailsByIndex(index: number): Promise<void> {
    try {
      const card = await this.getBonusCardByIndex(index);
      if (card) {
        const detailsButton = card.locator('button:has-text("Детальна інформація")');
        await detailsButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.SHORT });
        logger.success(`Детальная информация о бонусе по индексу ${index} открыта`);
      } else {
        throw new Error(`Карточка бонуса по индексу ${index} не найдена`);
      }
    } catch (error) {
      logger.error(`Ошибка открытия детальной информации по индексу ${index}`, error as Error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить название бонуса по индексу
   */
  @LogAction('Получение названия бонуса по индексу: {index}')
  @ValidateState()
  async getBonusTitleByIndex(index: number): Promise<string> {
    try {
      const card = await this.getBonusCardByIndex(index);
      if (card) {
        const title = await card.locator('.title').textContent();
        logger.success(`Название бонуса по индексу ${index}: ${title}`);
        return title || '';
      }
      return '';
    } catch (error) {
      logger.error(`Ошибка получения названия бонуса по индексу ${index}`, error as Error);
      return '';
    }
  }

  /**
   * Получить описание бонуса по индексу
   */
  @LogAction('Получение описания бонуса по индексу: {index}')
  @ValidateState()
  async getBonusDescriptionByIndex(index: number): Promise<string> {
    try {
      const card = await this.getBonusCardByIndex(index);
      if (card) {
        const description = await card.locator('.excerpt').textContent();
        logger.success(`Описание бонуса по индексу ${index}: ${description}`);
        return description || '';
      }
      return '';
    } catch (error) {
      logger.error(`Ошибка получения описания бонуса по индексу ${index}`, error as Error);
      return '';
    }
  }

  /**
   * Получить все названия бонусов
   */
  @LogAction('Получение всех названий бонусов')
  @ValidateState()
  async getAllBonusTitles(): Promise<string[]> {
    try {
      const cards = await this.getAllBonusCards();
      const titles = await Promise.all(
        cards.map(card => card.locator('.title').textContent())
      );
      logger.success(`Получены названия бонусов: ${titles.join(', ')}`);
      return titles.filter(title => title !== null) as string[];
    } catch (error) {
      logger.error('Ошибка получения названий бонусов', error as Error);
      return [];
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что карточки бонусов отображаются
   */
  @LogAction('Проверка отображения карточек бонусов')
  async areBonusCardsVisible(): Promise<boolean> {
    try {
      const count = await this.getBonusCardsCount();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопки подписки активны
   */
  @LogAction('Проверка активности кнопок подписки')
  async areSubscribeButtonsEnabled(): Promise<boolean> {
    try {
      const subscribeButtons = this.bonusCards.locator('button:has-text("Підписатися")');
      const firstButton = subscribeButtons.first();
      return await firstButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопки детальной информации активны
   */
  @LogAction('Проверка активности кнопок детальной информации')
  async areDetailsButtonsEnabled(): Promise<boolean> {
    try {
      const detailsButtons = this.bonusCards.locator('button:has-text("Детальна інформація")');
      const firstButton = detailsButtons.first();
      return await firstButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что секция полностью загружена
   */
  @LogAction('Проверка полной загрузки секции')
  async isSectionFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasCards = await this.areBonusCardsVisible();
      const hasButtons = await this.areSubscribeButtonsEnabled();
      
      return isLoaded && hasCards && hasButtons;
    } catch {
      return false;
    }
  }
}
