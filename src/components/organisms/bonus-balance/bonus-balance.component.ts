/**
 * Bonus Balance Component - Organism
 * Компонент бонусного баланса с прогрессом и промокодом
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { InputComponent } from '@components/atoms/input/input.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class BonusBalanceComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Заголовок секции
  readonly tabName: Locator;

  // Текущий баланс
  readonly currentBalance: Locator;

  // Прогресс бар
  readonly progressBar: Locator;

  // Лейблы прогресса
  readonly bonusLeft: Locator;
  readonly bonusRight: Locator;

  // Поле ввода промокода
  readonly promocodeInput: InputComponent;

  // Кнопка применения промокода
  readonly applyButton: ButtonComponent;

  // Баннер
  readonly banner: Locator;
  readonly bannerTitle: Locator;
  readonly bannerDescription: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Bonus Balance') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.tabName = root.locator('.tab-name');
    this.currentBalance = root.locator('.bonus-info .title');
    this.progressBar = root.locator('.progress .progress-bar');
    this.bonusLeft = root.locator('.bonus-left');
    this.bonusRight = root.locator('.bonus-right');

    // Инициализация компонентов
    this.promocodeInput = new InputComponent(
      page,
      root.locator('.form-group.with-input-btn input[placeholder*="промокод"]'),
      'Promocode Input'
    );

    this.applyButton = new ButtonComponent(
      page,
      root.locator('.form-group.with-input-btn button[wire\\:click="applyPromocode"]'),
      'Apply Promocode Button'
    );

    // Баннер
    this.banner = root.locator('.banner');
    this.bannerTitle = this.banner.locator('.banner-title');
    this.bannerDescription = this.banner.locator('.body-default');
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
      const isBalanceVisible = await this.currentBalance.isVisible();
      const isTabsVisible = await this.tabName.isVisible();
      
      return isVisible && isBalanceVisible && isTabsVisible;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.currentBalance.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент бонусного баланса загружен');
  }

  // ========== МЕТОДЫ РАБОТЫ С БАЛАНСОМ ==========

  /**
   * Получить текущий бонусный баланс
   */
  @LogAction('Получение текущего бонусного баланса')
  @ValidateState()
  async getCurrentBalance(): Promise<string> {
    try {
      const balance = await this.currentBalance.textContent();
      logger.success(`Текущий баланс: ${balance}`);
      return balance || '0.00';
    } catch (error) {
      logger.error('Ошибка получения баланса', error as Error);
      return '0.00';
    }
  }

  /**
   * Получить сумму для отыгрыша
   */
  @LogAction('Получение суммы для отыгрыша')
  @ValidateState()
  async getAmountToWager(): Promise<string> {
    try {
      const amount = await this.bonusLeft.locator('span').textContent();
      logger.success(`Сумма для отыгрыша: ${amount}`);
      return amount || '0.00';
    } catch (error) {
      logger.error('Ошибка получения суммы для отыгрыша', error as Error);
      return '0.00';
    }
  }

  /**
   * Получить оставшуюся сумму до ставки
   */
  @LogAction('Получение оставшейся суммы до ставки')
  @ValidateState()
  async getRemainingToWager(): Promise<string> {
    try {
      const remaining = await this.bonusRight.locator('span').textContent();
      logger.success(`Оставшаяся сумма: ${remaining}`);
      return remaining || '0.00';
    } catch (error) {
      logger.error('Ошибка получения оставшейся суммы', error as Error);
      return '0.00';
    }
  }

  /**
   * Получить прогресс отыгрыша в процентах
   */
  @LogAction('Получение прогресса отыгрыша')
  @ValidateState()
  async getWagerProgress(): Promise<number> {
    try {
      const progressBar = this.progressBar;
      const style = await progressBar.getAttribute('style');
      const widthMatch = style?.match(/width:\s*([\d.]+)%/);
      const progress = widthMatch ? parseFloat(widthMatch[1]) : 0;
      
      logger.success(`Прогресс отыгрыша: ${progress}%`);
      return progress;
    } catch (error) {
      logger.error('Ошибка получения прогресса', error as Error);
      return 0;
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С ПРОМОКОДОМ ==========

  /**
   * Ввести промокод
   */
  @LogAction('Ввод промокода: {promocode}')
  @ValidateState()
  async enterPromocode(promocode: string): Promise<void> {
    await this.promocodeInput.fill(promocode);
    logger.success(`Промокод введен: ${promocode}`);
  }

  /**
   * Очистить поле промокода
   */
  @LogAction('Очистка поля промокода')
  @ValidateState()
  async clearPromocode(): Promise<void> {
    await this.promocodeInput.clear();
    logger.success('Поле промокода очищено');
  }

  /**
   * Применить промокод
   */
  @LogAction('Применение промокода: {promocode}')
  @ValidateState()
  async applyPromocode(promocode: string): Promise<void> {
    await this.enterPromocode(promocode);
    await this.applyButton.click();
    
    // Ждем обработки запроса
    await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.MEDIUM });
    logger.success(`Промокод применен: ${promocode}`);
  }

  /**
   * Проверить, что кнопка применения активна
   */
  @LogAction('Проверка активности кнопки применения')
  async isApplyButtonEnabled(): Promise<boolean> {
    try {
      return await this.applyButton.isEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С БАННЕРОМ ==========

  /**
   * Получить заголовок баннера
   */
  @LogAction('Получение заголовка баннера')
  @ValidateState()
  async getBannerTitle(): Promise<string> {
    try {
      const title = await this.bannerTitle.textContent();
      logger.success(`Заголовок баннера: ${title}`);
      return title || '';
    } catch (error) {
      logger.error('Ошибка получения заголовка баннера', error as Error);
      return '';
    }
  }

  /**
   * Получить описание баннера
   */
  @LogAction('Получение описания баннера')
  @ValidateState()
  async getBannerDescription(): Promise<string> {
    try {
      const description = await this.bannerDescription.textContent();
      logger.success(`Описание баннера: ${description}`);
      return description || '';
    } catch (error) {
      logger.error('Ошибка получения описания баннера', error as Error);
      return '';
    }
  }

  /**
   * Проверить, что баннер отображается
   */
  @LogAction('Проверка отображения баннера')
  async isBannerVisible(): Promise<boolean> {
    try {
      return await this.banner.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что баланс больше нуля
   */
  @LogAction('Проверка наличия бонусного баланса')
  async hasBonusBalance(): Promise<boolean> {
    try {
      const balance = await this.getCurrentBalance();
      const numericBalance = parseFloat(balance.replace(/[^\d.,]/g, '').replace(',', '.'));
      return numericBalance > 0;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что есть прогресс отыгрыша
   */
  @LogAction('Проверка прогресса отыгрыша')
  async hasWagerProgress(): Promise<boolean> {
    try {
      const progress = await this.getWagerProgress();
      return progress > 0;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что промокод можно применить
   */
  @LogAction('Проверка возможности применения промокода')
  async canApplyPromocode(): Promise<boolean> {
    try {
      const isInputVisible = await this.promocodeInput.isVisible();
      const isButtonEnabled = await this.isApplyButtonEnabled();
      return isInputVisible && isButtonEnabled;
    } catch {
      return false;
    }
  }
}
