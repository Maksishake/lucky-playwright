/**
 * Bonus Conditions List Component - Molecule
 * Компонент списка условий бонуса
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusConditionsListComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Все элементы списка
  readonly listItems: Locator;

  // Элементы списка по индексу
  readonly listItem: Locator;

  // Текст элементов списка
  readonly listItemText: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Conditions List') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.listItems = root.locator('li');
    this.listItem = root.locator('li');
    this.listItemText = root.locator('.list-item-text');
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
      const hasItems = await this.listItems.count() > 0;
      
      return isVisible && hasItems;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.listItems.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Список условий бонуса загружен');
  }

  // ========== МЕТОДЫ РАБОТЫ СО СПИСКОМ ==========

  /**
   * Получить все условия
   */
  @LogAction('Получение всех условий бонуса')
  @ValidateState()
  async getAllConditions(): Promise<string[]> {
    try {
      const items = await this.listItems.all();
      const conditions = await Promise.all(
        items.map(async (item) => {
          const text = await item.locator('.list-item-text').textContent();
          return text || '';
        })
      );
      
      const filteredConditions = conditions.filter(condition => condition.trim() !== '');
      logger.success(`Получены условия бонуса: ${filteredConditions.length} пунктов`);
      return filteredConditions;
    } catch (error) {
      logger.error('Ошибка получения условий бонуса', error as Error);
      return [];
    }
  }

  /**
   * Получить условие по индексу
   */
  @LogAction('Получение условия бонуса по индексу: {index}')
  @ValidateState()
  async getConditionByIndex(index: number): Promise<string> {
    try {
      const item = this.listItems.nth(index);
      const text = await item.locator('.list-item-text').textContent();
      logger.success(`Условие бонуса по индексу ${index}: ${text}`);
      return text || '';
    } catch (error) {
      logger.error(`Ошибка получения условия бонуса по индексу ${index}`, error as Error);
      return '';
    }
  }

  /**
   * Получить количество условий
   */
  @LogAction('Получение количества условий бонуса')
  async getConditionsCount(): Promise<number> {
    try {
      const count = await this.listItems.count();
      logger.success(`Количество условий бонуса: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества условий бонуса', error as Error);
      return 0;
    }
  }

  /**
   * Найти условие по тексту
   */
  @LogAction('Поиск условия бонуса по тексту: {searchText}')
  @ValidateState()
  async findConditionByText(searchText: string): Promise<string | null> {
    try {
      const conditions = await this.getAllConditions();
      const foundCondition = conditions.find(condition => 
        condition.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (foundCondition) {
        logger.success(`Найдено условие бонуса: ${foundCondition}`);
        return foundCondition;
      } else {
        logger.warning(`Условие бонуса не найдено: ${searchText}`);
        return null;
      }
    } catch (error) {
      logger.error(`Ошибка поиска условия бонуса: ${searchText}`, error as Error);
      return null;
    }
  }

  /**
   * Найти индекс условия по тексту
   */
  @LogAction('Поиск индекса условия бонуса по тексту: {searchText}')
  @ValidateState()
  async findConditionIndexByText(searchText: string): Promise<number> {
    try {
      const conditions = await this.getAllConditions();
      const index = conditions.findIndex(condition => 
        condition.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (index !== -1) {
        logger.success(`Найден индекс условия бонуса: ${index}`);
        return index;
      } else {
        logger.warning(`Индекс условия бонуса не найден: ${searchText}`);
        return -1;
      }
    } catch (error) {
      logger.error(`Ошибка поиска индекса условия бонуса: ${searchText}`, error as Error);
      return -1;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ СПЕЦИФИЧНЫХ УСЛОВИЙ ==========

  /**
   * Получить минимальную сумму депозита
   */
  @LogAction('Получение минимальной суммы депозита')
  @ValidateState()
  async getMinDepositAmount(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Мінімальна сума депозиту');
      if (condition) {
        const amount = condition.split(':')[1]?.trim() || '';
        logger.success(`Минимальная сумма депозита: ${amount}`);
        return amount;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения минимальной суммы депозита', error as Error);
      return '';
    }
  }

  /**
   * Получить максимальный бонус
   */
  @LogAction('Получение максимального бонуса')
  @ValidateState()
  async getMaxBonusAmount(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Макс. Бонус');
      if (condition) {
        const amount = condition.split(':')[1]?.trim() || '';
        logger.success(`Максимальный бонус: ${amount}`);
        return amount;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения максимального бонуса', error as Error);
      return '';
    }
  }

  /**
   * Получить вейджер
   */
  @LogAction('Получение вейджера')
  @ValidateState()
  async getWager(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Wager');
      if (condition) {
        const wager = condition.split(':')[1]?.trim() || '';
        logger.success(`Вейджер: ${wager}`);
        return wager;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения вейджера', error as Error);
      return '';
    }
  }

  /**
   * Получить валюту
   */
  @LogAction('Получение валюты')
  @ValidateState()
  async getCurrency(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Валюта');
      if (condition) {
        const currency = condition.split(':')[1]?.trim() || '';
        logger.success(`Валюта: ${currency}`);
        return currency;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения валюты', error as Error);
      return '';
    }
  }

  /**
   * Получить тип игр
   */
  @LogAction('Получение типа игр')
  @ValidateState()
  async getGameType(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Only slots');
      if (condition) {
        logger.success(`Тип игр: ${condition}`);
        return condition;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения типа игр', error as Error);
      return '';
    }
  }

  /**
   * Получить ставку на один FS
   */
  @LogAction('Получение ставки на один FS')
  @ValidateState()
  async getFreeSpinBet(): Promise<string> {
    try {
      const condition = await this.findConditionByText('Ставка на один FS');
      if (condition) {
        const bet = condition.split(':')[1]?.trim() || '';
        logger.success(`Ставка на один FS: ${bet}`);
        return bet;
      }
      return '';
    } catch (error) {
      logger.error('Ошибка получения ставки на один FS', error as Error);
      return '';
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что список полностью загружен
   */
  @LogAction('Проверка полной загрузки списка условий')
  async isListFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasItems = await this.getConditionsCount() > 0;
      const allItemsVisible = await this.areAllItemsVisible();
      
      return isLoaded && hasItems && allItemsVisible;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все элементы списка видимы
   */
  @LogAction('Проверка видимости всех элементов списка')
  async areAllItemsVisible(): Promise<boolean> {
    try {
      const items = await this.listItems.all();
      const visibilityChecks = await Promise.all(
        items.map(item => item.isVisible())
      );
      return visibilityChecks.every(isVisible => isVisible);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что список содержит определенное количество элементов
   */
  @LogAction('Проверка количества элементов списка: {expectedCount}')
  async hasExpectedCount(expectedCount: number): Promise<boolean> {
    try {
      const actualCount = await this.getConditionsCount();
      return actualCount === expectedCount;
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОИСКА ==========

  /**
   * Проверить, содержит ли список текст
   */
  @LogAction('Проверка содержания текста в списке: {text}')
  async containsText(text: string): Promise<boolean> {
    try {
      const conditions = await this.getAllConditions();
      return conditions.some(condition => 
        condition.toLowerCase().includes(text.toLowerCase())
      );
    } catch {
      return false;
    }
  }

  /**
   * Проверить, содержит ли список все указанные тексты
   */
  @LogAction('Проверка содержания всех текстов в списке: {texts}')
  async containsAllTexts(texts: string[]): Promise<boolean> {
    try {
      const conditions = await this.getAllConditions();
      return texts.every(text => 
        conditions.some(condition => 
          condition.toLowerCase().includes(text.toLowerCase())
        )
      );
    } catch {
      return false;
    }
  }

  /**
   * Проверить, содержит ли список хотя бы один из указанных текстов
   */
  @LogAction('Проверка содержания хотя бы одного текста в списке: {texts}')
  async containsAnyText(texts: string[]): Promise<boolean> {
    try {
      const conditions = await this.getAllConditions();
      return texts.some(text => 
        conditions.some(condition => 
          condition.toLowerCase().includes(text.toLowerCase())
        )
      );
    } catch {
      return false;
    }
  }
}
