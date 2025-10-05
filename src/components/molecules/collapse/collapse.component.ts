/**
 * Collapse Component - Molecule
 * Компонент коллапса для сворачивания/разворачивания контента
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class CollapseComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Вопрос/заголовок коллапса
  readonly question: Locator;

  // Ответ/контент коллапса
  readonly answer: Locator;

  // Иконка коллапса
  readonly icon: IconComponent;

  // Кнопка переключения
  readonly toggleButton: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Collapse') {
    super(page, root, componentName);

    // Инициализация локаторов
    this.question = root.locator('.collapse-question');
    this.answer = root.locator('.collapse-answer');
    this.toggleButton = this.question;
    this.icon = new IconComponent(
      page,
      this.question.locator('.icon'),
      'Collapse Icon'
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
      const hasQuestion = await this.question.isVisible();
      const hasAnswer = await this.answer.isVisible();
      
      return isVisible && hasQuestion && hasAnswer;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.question.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент коллапса загружен');
  }

  // ========== МЕТОДЫ РАБОТЫ С КОЛЛАПСОМ ==========

  /**
   * Развернуть коллапс
   */
  @LogAction('Разворачивание коллапса')
  @ValidateState()
  async expand(): Promise<void> {
    try {
      if (!await this.isExpanded()) {
        await this.toggleButton.click();
        await this.answer.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        logger.success('Коллапс развернут');
      } else {
        logger.info('Коллапс уже развернут');
      }
    } catch (error) {
      logger.error('Ошибка разворачивания коллапса', error as Error);
      throw error;
    }
  }

  /**
   * Свернуть коллапс
   */
  @LogAction('Сворачивание коллапса')
  @ValidateState()
  async collapse(): Promise<void> {
    try {
      if (await this.isExpanded()) {
        await this.toggleButton.click();
        await this.answer.waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT });
        logger.success('Коллапс свернут');
      } else {
        logger.info('Коллапс уже свернут');
      }
    } catch (error) {
      logger.error('Ошибка сворачивания коллапса', error as Error);
      throw error;
    }
  }

  /**
   * Переключить состояние коллапса
   */
  @LogAction('Переключение состояния коллапса')
  @ValidateState()
  async toggle(): Promise<void> {
    try {
      await this.toggleButton.click();
      await this.page.waitForTimeout(100); // Небольшая задержка для анимации
      logger.success('Состояние коллапса переключено');
    } catch (error) {
      logger.error('Ошибка переключения состояния коллапса', error as Error);
      throw error;
    }
  }

  /**
   * Проверить, развернут ли коллапс
   */
  @LogAction('Проверка состояния коллапса')
  async isExpanded(): Promise<boolean> {
    try {
      const isAnswerVisible = await this.answer.isVisible();
      const hasOpenClass = await this.root.getAttribute('class');
      const isOpen = hasOpenClass?.includes('open') || false;
      
      return isAnswerVisible && isOpen;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, свернут ли коллапс
   */
  @LogAction('Проверка состояния коллапса (свернут)')
  async isCollapsed(): Promise<boolean> {
    try {
      return !await this.isExpanded();
    } catch {
      return true;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить текст вопроса/заголовка
   */
  @LogAction('Получение текста вопроса коллапса')
  @ValidateState()
  async getQuestionText(): Promise<string> {
    try {
      const text = await this.question.textContent();
      logger.success(`Текст вопроса коллапса: ${text}`);
      return text || '';
    } catch (error) {
      logger.error('Ошибка получения текста вопроса коллапса', error as Error);
      return '';
    }
  }

  /**
   * Получить текст ответа/контента
   */
  @LogAction('Получение текста ответа коллапса')
  @ValidateState()
  async getAnswerText(): Promise<string> {
    try {
      const text = await this.answer.textContent();
      logger.success(`Текст ответа коллапса: ${text}`);
      return text || '';
    } catch (error) {
      logger.error('Ошибка получения текста ответа коллапса', error as Error);
      return '';
    }
  }

  /**
   * Получить весь текст коллапса
   */
  @LogAction('Получение всего текста коллапса')
  @ValidateState()
  async getAllText(): Promise<string> {
    try {
      const questionText = await this.getQuestionText();
      const answerText = await this.getAnswerText();
      const allText = `${questionText} ${answerText}`.trim();
      logger.success(`Весь текст коллапса: ${allText}`);
      return allText;
    } catch (error) {
      logger.error('Ошибка получения всего текста коллапса', error as Error);
      return '';
    }
  }

  // ========== МЕТОДЫ РАБОТЫ С ИКОНКОЙ ==========

  /**
   * Получить направление иконки
   */
  @LogAction('Получение направления иконки коллапса')
  @ValidateState()
  async getIconDirection(): Promise<string> {
    try {
      const isExpanded = await this.isExpanded();
      const direction = isExpanded ? 'up' : 'down';
      logger.success(`Направление иконки коллапса: ${direction}`);
      return direction;
    } catch (error) {
      logger.error('Ошибка получения направления иконки коллапса', error as Error);
      return 'unknown';
    }
  }

  /**
   * Проверить, что иконка видна
   */
  @LogAction('Проверка видимости иконки коллапса')
  async isIconVisible(): Promise<boolean> {
    try {
      return await this.icon.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что коллапс полностью загружен
   */
  @LogAction('Проверка полной загрузки коллапса')
  async isCollapseFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasQuestion = await this.question.isVisible();
      const hasAnswer = await this.answer.isVisible();
      const hasIcon = await this.isIconVisible();
      
      return isLoaded && hasQuestion && hasAnswer && hasIcon;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что коллапс кликабелен
   */
  @LogAction('Проверка кликабельности коллапса')
  async isClickable(): Promise<boolean> {
    try {
      return await this.toggleButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что контент отображается
   */
  @LogAction('Проверка отображения контента коллапса')
  async isContentVisible(): Promise<boolean> {
    try {
      return await this.answer.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОИСКА ==========

  /**
   * Проверить, содержит ли коллапс текст
   */
  @LogAction('Проверка содержания текста в коллапсе: {text}')
  async containsText(text: string): Promise<boolean> {
    try {
      const allText = await this.getAllText();
      return allText.includes(text);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, содержит ли вопрос текст
   */
  @LogAction('Проверка содержания текста в вопросе: {text}')
  async questionContainsText(text: string): Promise<boolean> {
    try {
      const questionText = await this.getQuestionText();
      return questionText.includes(text);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, содержит ли ответ текст
   */
  @LogAction('Проверка содержания текста в ответе: {text}')
  async answerContainsText(text: string): Promise<boolean> {
    try {
      const answerText = await this.getAnswerText();
      return answerText.includes(text);
    } catch {
      return false;
    }
  }
}
