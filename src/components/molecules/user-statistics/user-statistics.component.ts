/**
 * User Statistics Component - Molecule
 * Компонент статистики пользователя с кнопкой "Деталі"
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class UserStatisticsComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
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

  // Заголовок секции статистики
  readonly statisticsTitle: Locator;

  // Иконка статистики
  readonly statisticsIcon: IconComponent;

  // Кнопка "Деталі"
  readonly detailsButton: ButtonComponent;

  // Блоки статистики
  readonly statisticsBlocks: Locator;

  // Общая сумма выигрышей
  readonly totalWinningsBlock: Locator;
  readonly totalWinningsHeading: Locator;
  readonly totalWinningsValue: Locator;
  readonly totalWinningsIcon: Locator;

  // Всего ставок
  readonly totalBetsBlock: Locator;
  readonly totalBetsHeading: Locator;
  readonly totalBetsValue: Locator;
  readonly totalBetsIcon: Locator;

  // Всего использовано в ставках
  readonly totalUsedBlock: Locator;
  readonly totalUsedHeading: Locator;
  readonly totalUsedValue: Locator;
  readonly totalUsedIcon: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'User Statistics') {
    super(page, root, componentName);

    // Инициализация основных элементов
    this.statisticsTitle = root.locator('.text-white:has-text("Статистика")');
    this.statisticsIcon = new IconComponent(
      page,
      root.locator('.icon-lg'),
      'Statistics Icon'
    );
    this.detailsButton = new ButtonComponent(
      page,
      root.locator('.btn.btn-link'),
      'Details Button'
    );

    // Инициализация блоков статистики
    this.statisticsBlocks = root.locator('.flex-inner-auto--3');
    
    // Блок общей суммы выигрышей
    this.totalWinningsBlock = this.statisticsBlocks.locator('.content-block').first();
    this.totalWinningsHeading = this.totalWinningsBlock.locator('.content-block-heading');
    this.totalWinningsValue = this.totalWinningsBlock.locator('.content-block-total span');
    this.totalWinningsIcon = this.totalWinningsBlock.locator('.content-block-total img');

    // Блок всего ставок
    this.totalBetsBlock = this.statisticsBlocks.locator('.content-block').nth(1);
    this.totalBetsHeading = this.totalBetsBlock.locator('.content-block-heading');
    this.totalBetsValue = this.totalBetsBlock.locator('.content-block-total span');
    this.totalBetsIcon = this.totalBetsBlock.locator('.content-block-total img');

    // Блок всего использовано в ставках
    this.totalUsedBlock = this.statisticsBlocks.locator('.content-block').nth(2);
    this.totalUsedHeading = this.totalUsedBlock.locator('.content-block-heading');
    this.totalUsedValue = this.totalUsedBlock.locator('.content-block-total span');
    this.totalUsedIcon = this.totalUsedBlock.locator('.content-block-total img');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить загрузку компонента статистики
   */
  @LogAction('Проверка загрузки компонента статистики')
  @ValidateState()
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.root.isVisible();
      const hasTitle = await this.statisticsTitle.isVisible();
      const hasIcon = await this.statisticsIcon.isLoaded();
      const hasButton = await this.detailsButton.isLoaded();
      const hasBlocks = await this.statisticsBlocks.isVisible();
      
      return isVisible && hasTitle && hasIcon && hasButton && hasBlocks;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента статистики
   */
  @LogAction('Ожидание загрузки компонента статистики')
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.statisticsTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.statisticsIcon.waitForLoad();
    await this.detailsButton.waitForLoad();
    await this.statisticsBlocks.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент статистики загружен');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить заголовок секции статистики
   */
  @LogAction('Получение заголовка секции статистики')
  @ValidateState()
  async getStatisticsTitle(): Promise<string> {
    try {
      const title = await this.statisticsTitle.textContent();
      logger.success(`Заголовок статистики: ${title}`);
      return title?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения заголовка статистики', error as Error);
      return '';
    }
  }

  /**
   * Получить общую сумму выигрышей
   */
  @LogAction('Получение общей суммы выигрышей')
  @ValidateState()
  async getTotalWinnings(): Promise<string> {
    try {
      const value = await this.totalWinningsValue.textContent();
      logger.success(`Общая сумма выигрышей: ${value}`);
      return value?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения общей суммы выигрышей', error as Error);
      return '';
    }
  }

  /**
   * Получить общее количество ставок
   */
  @LogAction('Получение общего количества ставок')
  @ValidateState()
  async getTotalBets(): Promise<string> {
    try {
      const value = await this.totalBetsValue.textContent();
      logger.success(`Общее количество ставок: ${value}`);
      return value?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения общего количества ставок', error as Error);
      return '';
    }
  }

  /**
   * Получить общую сумму использованную в ставках
   */
  @LogAction('Получение общей суммы использованной в ставках')
  @ValidateState()
  async getTotalUsedInBets(): Promise<string> {
    try {
      const value = await this.totalUsedValue.textContent();
      logger.success(`Общая сумма использованная в ставках: ${value}`);
      return value?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения общей суммы использованной в ставках', error as Error);
      return '';
    }
  }

  /**
   * Получить полную статистику пользователя
   */
  @LogAction('Получение полной статистики пользователя')
  @ValidateState()
  async getStatistics(): Promise<{
    totalWinnings: string;
    totalBets: string;
    totalUsedInBets: string;
  }> {
    const [totalWinnings, totalBets, totalUsedInBets] = await Promise.all([
      this.getTotalWinnings(),
      this.getTotalBets(),
      this.getTotalUsedInBets()
    ]);

    return {
      totalWinnings,
      totalBets,
      totalUsedInBets
    };
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Показать детали статистики
   */
  @LogAction('Показ деталей статистики')
  @ValidateState()
  async showDetails(): Promise<void> {
    try {
      await this.detailsButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success('Детали статистики показаны');
    } catch (error) {
      logger.error('Ошибка показа деталей статистики', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по заголовку статистики
   */
  @LogAction('Клик по заголовку статистики')
  @ValidateState()
  async clickStatisticsTitle(): Promise<void> {
    try {
      await this.statisticsTitle.click();
      logger.success('Клик по заголовку статистики выполнен');
    } catch (error) {
      logger.error('Ошибка клика по заголовку статистики', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по блоку общей суммы выигрышей
   */
  @LogAction('Клик по блоку общей суммы выигрышей')
  @ValidateState()
  async clickTotalWinningsBlock(): Promise<void> {
    try {
      await this.totalWinningsBlock.click();
      logger.success('Клик по блоку общей суммы выигрышей выполнен');
    } catch (error) {
      logger.error('Ошибка клика по блоку общей суммы выигрышей', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по блоку общего количества ставок
   */
  @LogAction('Клик по блоку общего количества ставок')
  @ValidateState()
  async clickTotalBetsBlock(): Promise<void> {
    try {
      await this.totalBetsBlock.click();
      logger.success('Клик по блоку общего количества ставок выполнен');
    } catch (error) {
      logger.error('Ошибка клика по блоку общего количества ставок', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по блоку общей суммы использованной в ставках
   */
  @LogAction('Клик по блоку общей суммы использованной в ставках')
  @ValidateState()
  async clickTotalUsedBlock(): Promise<void> {
    try {
      await this.totalUsedBlock.click();
      logger.success('Клик по блоку общей суммы использованной в ставках выполнен');
    } catch (error) {
      logger.error('Ошибка клика по блоку общей суммы использованной в ставках', error as Error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что заголовок статистики отображается
   */
  @LogAction('Проверка отображения заголовка статистики')
  async isStatisticsTitleVisible(): Promise<boolean> {
    try {
      return await this.statisticsTitle.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка "Деталі" активна
   */
  @LogAction('Проверка активности кнопки "Деталі"')
  async isDetailsButtonEnabled(): Promise<boolean> {
    try {
      return await this.detailsButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что блоки статистики отображаются
   */
  @LogAction('Проверка отображения блоков статистики')
  async areStatisticsBlocksVisible(): Promise<boolean> {
    try {
      return await this.statisticsBlocks.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что блок общей суммы выигрышей отображается
   */
  @LogAction('Проверка отображения блока общей суммы выигрышей')
  async isTotalWinningsBlockVisible(): Promise<boolean> {
    try {
      return await this.totalWinningsBlock.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что блок общего количества ставок отображается
   */
  @LogAction('Проверка отображения блока общего количества ставок')
  async isTotalBetsBlockVisible(): Promise<boolean> {
    try {
      return await this.totalBetsBlock.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что блок общей суммы использованной в ставках отображается
   */
  @LogAction('Проверка отображения блока общей суммы использованной в ставках')
  async isTotalUsedBlockVisible(): Promise<boolean> {
    try {
      return await this.totalUsedBlock.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что все значения статистики не пустые
   */
  @LogAction('Проверка заполненности значений статистики')
  async areStatisticsValuesFilled(): Promise<boolean> {
    try {
      const [totalWinnings, totalBets, totalUsedInBets] = await Promise.all([
        this.getTotalWinnings(),
        this.getTotalBets(),
        this.getTotalUsedInBets()
      ]);

      const areFilled = totalWinnings.length > 0 && totalBets.length > 0 && totalUsedInBets.length > 0;
      logger.success(`Значения статистики заполнены: ${areFilled}`);
      return areFilled;
    } catch (error) {
      logger.error('Ошибка проверки заполненности значений статистики', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что значения статистики являются числами
   */
  @LogAction('Проверка числового формата значений статистики')
  async areStatisticsValuesNumeric(): Promise<boolean> {
    try {
      const [totalWinnings, totalBets, totalUsedInBets] = await Promise.all([
        this.getTotalWinnings(),
        this.getTotalBets(),
        this.getTotalUsedInBets()
      ]);

      const areNumeric = !isNaN(parseFloat(totalWinnings)) && 
                        !isNaN(parseFloat(totalBets)) && 
                        !isNaN(parseFloat(totalUsedInBets));
      
      logger.success(`Значения статистики являются числами: ${areNumeric}`);
      return areNumeric;
    } catch (error) {
      logger.error('Ошибка проверки числового формата значений статистики', error as Error);
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить количество блоков статистики
   */
  @LogAction('Получение количества блоков статистики')
  @ValidateState()
  async getStatisticsBlocksCount(): Promise<number> {
    try {
      const count = await this.statisticsBlocks.locator('.content-block').count();
      logger.success(`Количество блоков статистики: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества блоков статистики', error as Error);
      return 0;
    }
  }

  /**
   * Получить заголовки всех блоков статистики
   */
  @LogAction('Получение заголовков всех блоков статистики')
  @ValidateState()
  async getStatisticsBlockHeadings(): Promise<string[]> {
    try {
      const headings = await this.statisticsBlocks.locator('.content-block-heading').allTextContents();
      const trimmedHeadings = headings.map(heading => heading.trim());
      logger.success(`Заголовки блоков статистики: ${trimmedHeadings.join(', ')}`);
      return trimmedHeadings;
    } catch (error) {
      logger.error('Ошибка получения заголовков блоков статистики', error as Error);
      return [];
    }
  }

  /**
   * Получить значения всех блоков статистики
   */
  @LogAction('Получение значений всех блоков статистики')
  @ValidateState()
  async getStatisticsBlockValues(): Promise<string[]> {
    try {
      const values = await this.statisticsBlocks.locator('.content-block-total span').allTextContents();
      const trimmedValues = values.map(value => value.trim());
      logger.success(`Значения блоков статистики: ${trimmedValues.join(', ')}`);
      return trimmedValues;
    } catch (error) {
      logger.error('Ошибка получения значений блоков статистики', error as Error);
      return [];
    }
  }
}
