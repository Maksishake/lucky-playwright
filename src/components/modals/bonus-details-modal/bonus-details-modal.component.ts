/**
 * Bonus Details Modal Component - Modal
 * Модальное окно детальной информации о бонусе
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { CollapseComponent } from '@components/molecules/collapse/collapse.component';
import { BonusConditionsListComponent } from '@components/molecules/bonus-conditions-list/bonus-conditions-list.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusDetailsModalComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Заголовок модального окна
  readonly modalTitle: Locator;

  // Кнопка закрытия
  readonly closeButton: IconComponent;

  // Изображение бонуса
  readonly bonusImage: Locator;

  // Название бонуса
  readonly bonusTitle: Locator;

  // Описание бонуса
  readonly bonusDescription: Locator;

  // Коллапсы с условиями
  readonly bonusConditionsCollapse: CollapseComponent;
  readonly freeSpinsCollapse: CollapseComponent;

  // Списки условий
  readonly bonusConditionsList: BonusConditionsListComponent;
  readonly freeSpinsConditionsList: BonusConditionsListComponent;

  // Кнопка подписки
  readonly subscribeButton: ButtonComponent;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Details Modal') {
    super(page, root, componentName);

    // Инициализация основных элементов
    this.modalTitle = root.locator('.modal-title');
    this.closeButton = new IconComponent(
      page,
      root.locator('.modal-close-alpine'),
      'Close Button'
    );

    // Изображение и информация о бонусе
    this.bonusImage = root.locator('.round-lg.image-cover');
    this.bonusTitle = root.locator('.row-card h3');
    this.bonusDescription = root.locator('.collapse-answer > div:first-child');

    // Коллапсы
    this.bonusConditionsCollapse = new CollapseComponent(
      page,
      root.locator('.collapse').first(),
      'Bonus Conditions Collapse'
    );

    this.freeSpinsCollapse = new CollapseComponent(
      page,
      root.locator('.collapse').nth(1),
      'Free Spins Collapse'
    );

    // Списки условий
    this.bonusConditionsList = new BonusConditionsListComponent(
      page,
      root.locator('.collapse').first().locator('ul'),
      'Bonus Conditions List'
    );

    this.freeSpinsConditionsList = new BonusConditionsListComponent(
      page,
      root.locator('.collapse').nth(1).locator('ul'),
      'Free Spins Conditions List'
    );

    // Кнопка подписки
    this.subscribeButton = new ButtonComponent(
      page,
      root.locator('button:has-text("Підписатися")'),
      'Subscribe Button'
    );
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость модального окна
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку модального окна
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.isVisible();
      const hasTitle = await this.bonusTitle.isVisible();
      const hasImage = await this.bonusImage.isVisible();
      const hasSubscribeButton = await this.subscribeButton.isVisible();
      
      return isVisible && hasTitle && hasImage && hasSubscribeButton;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки модального окна
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.bonusTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Модальное окно детальной информации о бонусе загружено');
  }

  /**
   * Закрыть модальное окно
   */
  @LogAction('Закрытие модального окна детальной информации о бонусе')
  @ValidateState()
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.root.waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT });
    logger.success('Модальное окно детальной информации о бонусе закрыто');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить название бонуса
   */
  @LogAction('Получение названия бонуса')
  @ValidateState()
  async getBonusTitle(): Promise<string> {
    try {
      const title = await this.bonusTitle.textContent();
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
  async getBonusDescription(): Promise<string> {
    try {
      const description = await this.bonusDescription.textContent();
      logger.success(`Описание бонуса: ${description}`);
      return description || '';
    } catch (error) {
      logger.error('Ошибка получения описания бонуса', error as Error);
      return '';
    }
  }

  /**
   * Получить URL изображения бонуса
   */
  @LogAction('Получение URL изображения бонуса')
  @ValidateState()
  async getBonusImageUrl(): Promise<string> {
    try {
      const imageUrl = await this.bonusImage.getAttribute('src');
      logger.success(`URL изображения бонуса: ${imageUrl}`);
      return imageUrl || '';
    } catch (error) {
      logger.error('Ошибка получения URL изображения бонуса', error as Error);
      return '';
    }
  }

  /**
   * Получить alt текст изображения бонуса
   */
  @LogAction('Получение alt текста изображения бонуса')
  @ValidateState()
  async getBonusImageAlt(): Promise<string> {
    try {
      const altText = await this.bonusImage.getAttribute('alt');
      logger.success(`Alt текст изображения бонуса: ${altText}`);
      return altText || '';
    } catch (error) {
      logger.error('Ошибка получения alt текста изображения бонуса', error as Error);
      return '';
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С КОЛЛАПСАМИ ==========

  /**
   * Развернуть коллапс с условиями бонуса
   */
  @LogAction('Разворачивание коллапса с условиями бонуса')
  @ValidateState()
  async expandBonusConditions(): Promise<void> {
    await this.bonusConditionsCollapse.expand();
    logger.success('Коллапс с условиями бонуса развернут');
  }

  /**
   * Свернуть коллапс с условиями бонуса
   */
  @LogAction('Сворачивание коллапса с условиями бонуса')
  @ValidateState()
  async collapseBonusConditions(): Promise<void> {
    await this.bonusConditionsCollapse.collapse();
    logger.success('Коллапс с условиями бонуса свернут');
  }

  /**
   * Развернуть коллапс с условиями фриспинов
   */
  @LogAction('Разворачивание коллапса с условиями фриспинов')
  @ValidateState()
  async expandFreeSpinsConditions(): Promise<void> {
    await this.freeSpinsCollapse.expand();
    logger.success('Коллапс с условиями фриспинов развернут');
  }

  /**
   * Свернуть коллапс с условиями фриспинов
   */
  @LogAction('Сворачивание коллапса с условиями фриспинов')
  @ValidateState()
  async collapseFreeSpinsConditions(): Promise<void> {
    await this.freeSpinsCollapse.collapse();
    logger.success('Коллапс с условиями фриспинов свернут');
  }

  /**
   * Проверить, развернут ли коллапс с условиями бонуса
   */
  @LogAction('Проверка состояния коллапса с условиями бонуса')
  async isBonusConditionsExpanded(): Promise<boolean> {
    return await this.bonusConditionsCollapse.isExpanded();
  }

  /**
   * Проверить, развернут ли коллапс с условиями фриспинов
   */
  @LogAction('Проверка состояния коллапса с условиями фриспинов')
  async isFreeSpinsConditionsExpanded(): Promise<boolean> {
    return await this.freeSpinsCollapse.isExpanded();
  }

  // ========== МЕТОДЫ РАБОТЫ С УСЛОВИЯМИ ==========

  /**
   * Получить все условия бонуса
   */
  @LogAction('Получение всех условий бонуса')
  @ValidateState()
  async getBonusConditions(): Promise<string[]> {
    try {
      const conditions = await this.bonusConditionsList.getAllConditions();
      logger.success(`Условия бонуса получены: ${conditions.length} пунктов`);
      return conditions;
    } catch (error) {
      logger.error('Ошибка получения условий бонуса', error as Error);
      return [];
    }
  }

  /**
   * Получить все условия фриспинов
   */
  @LogAction('Получение всех условий фриспинов')
  @ValidateState()
  async getFreeSpinsConditions(): Promise<string[]> {
    try {
      const conditions = await this.freeSpinsConditionsList.getAllConditions();
      logger.success(`Условия фриспинов получены: ${conditions.length} пунктов`);
      return conditions;
    } catch (error) {
      logger.error('Ошибка получения условий фриспинов', error as Error);
      return [];
    }
  }

  /**
   * Получить условие бонуса по индексу
   */
  @LogAction('Получение условия бонуса по индексу: {index}')
  @ValidateState()
  async getBonusConditionByIndex(index: number): Promise<string> {
    try {
      const condition = await this.bonusConditionsList.getConditionByIndex(index);
      logger.success(`Условие бонуса по индексу ${index}: ${condition}`);
      return condition;
    } catch (error) {
      logger.error(`Ошибка получения условия бонуса по индексу ${index}`, error as Error);
      return '';
    }
  }

  /**
   * Получить условие фриспинов по индексу
   */
  @LogAction('Получение условия фриспинов по индексу: {index}')
  @ValidateState()
  async getFreeSpinsConditionByIndex(index: number): Promise<string> {
    try {
      const condition = await this.freeSpinsConditionsList.getConditionByIndex(index);
      logger.success(`Условие фриспинов по индексу ${index}: ${condition}`);
      return condition;
    } catch (error) {
      logger.error(`Ошибка получения условия фриспинов по индексу ${index}`, error as Error);
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

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что модальное окно полностью загружено
   */
  @LogAction('Проверка полной загрузки модального окна')
  async isModalFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasImage = await this.bonusImage.isVisible();
      const hasTitle = await this.bonusTitle.isVisible();
      const hasConditions = await this.bonusConditionsCollapse.isVisible();
      const hasSubscribeButton = await this.subscribeButton.isVisible();
      
      return isLoaded && hasImage && hasTitle && hasConditions && hasSubscribeButton;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что изображение загружено
   */
  @LogAction('Проверка загрузки изображения бонуса')
  async isBonusImageLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.bonusImage.isVisible();
      const hasSrc = await this.getBonusImageUrl() !== '';
      return isVisible && hasSrc;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все коллапсы развернуты
   */
  @LogAction('Проверка состояния всех коллапсов')
  async areAllCollapsesExpanded(): Promise<boolean> {
    try {
      const bonusExpanded = await this.isBonusConditionsExpanded();
      const freeSpinsExpanded = await this.isFreeSpinsConditionsExpanded();
      return bonusExpanded && freeSpinsExpanded;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что все условия отображаются
   */
  @LogAction('Проверка отображения всех условий')
  async areAllConditionsVisible(): Promise<boolean> {
    try {
      const bonusConditionsVisible = await this.bonusConditionsList.isVisible();
      const freeSpinsConditionsVisible = await this.freeSpinsConditionsList.isVisible();
      return bonusConditionsVisible && freeSpinsConditionsVisible;
    } catch {
      return false;
    }
  }
}
