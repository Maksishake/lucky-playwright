/**
 * Input Component - Atom
 * Атомарный компонент поля ввода
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IFormComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';

export class InputComponent extends BaseComponent implements IFormComponent {
  constructor(page: Page, root: Locator, componentName: string = 'Input') {
    super(page, root, componentName);
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость поля ввода
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку поля ввода
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки поля ввода
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на поле ввода
   */
  @LogAction('Click input')
  @ValidateState()
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Навести курсор на поле ввода
   */
  @LogAction('Hover input')
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /**
   * Заполнить поле ввода
   */
  @LogAction('Fill input')
  @ValidateState()
  async fill(value: string): Promise<void> {
    await this.root.fill(value);
  }

  /**
   * Очистить поле ввода
   */
  @LogAction('Clear input')
  async clear(): Promise<void> {
    await this.root.clear();
  }

  /**
   * Ввести текст по символам
   */
  @LogAction('Type input')
  @ValidateState()
  async type(text: string, options?: { delay?: number }): Promise<void> {
    await this.root.type(text, options);
  }

  /**
   * Нажать клавишу
   */
  @LogAction('Press key')
  async pressKey(key: string): Promise<void> {
    await this.root.press(key);
  }

  /**
   * Нажать Enter
   */
  @LogAction('Press Enter')
  async pressEnter(): Promise<void> {
    await this.root.press('Enter');
  }

  /**
   * Нажать Escape
   */
  @LogAction('Press Escape')
  async pressEscape(): Promise<void> {
    await this.root.press('Escape');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить значение поля ввода
   */
  @LogAction('Get input value')
  async getValue(): Promise<string> {
    try {
      return await this.root.inputValue();
    } catch {
      return '';
    }
  }

  /**
   * Получить текст поля ввода
   */
  @LogAction('Get input text')
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить placeholder
   */
  @LogAction('Get input placeholder')
  async getPlaceholder(): Promise<string | null> {
    try {
      return await this.root.getAttribute('placeholder');
    } catch {
      return null;
    }
  }

  /**
   * Получить атрибут поля ввода
   */
  async getAttribute(name: string): Promise<string | null> {
    try {
      return await this.root.getAttribute(name);
    } catch {
      return null;
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить активность поля ввода
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность поля ввода
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, пустое ли поле ввода
   */
  async isEmpty(): Promise<boolean> {
    const value = await this.getValue();
    return value === '';
  }

  /**
   * Проверить, активно ли поле ввода
   */
  async isFocused(): Promise<boolean> {
    try {
      return await this.root.evaluate(el => el === document.activeElement);
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли поле обязательным
   */
  async isRequired(): Promise<boolean> {
    try {
      const required = await this.root.getAttribute('required');
      return required !== null;
    } catch {
      return false;
    }
  }

  /**
   * Проверить валидность поля
   */
  async isValid(): Promise<boolean> {
    try {
      return await this.root.evaluate(el => (el as HTMLInputElement).validity.valid);
    } catch {
      return false;
    }
  }

  /**
   * Получить сообщение об ошибке
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      return await this.root.evaluate(el => (el as HTMLInputElement).validationMessage);
    } catch {
      return null;
    }
  }

  // ========== СПЕЦИАЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Выделить весь текст
   */
  @LogAction('Select all text')
  async selectAll(): Promise<void> {
    await this.root.selectText();
  }

  /**
   * Скопировать текст
   */
  @LogAction('Copy text')
  async copy(): Promise<void> {
    await this.root.press('Control+c');
  }

  /**
   * Вставить текст
   */
  @LogAction('Paste text')
  async paste(): Promise<void> {
    await this.root.press('Control+v');
  }

  /**
   * Вырезать текст
   */
  @LogAction('Cut text')
  async cut(): Promise<void> {
    await this.root.press('Control+x');
  }

  /**
   * Отменить действие
   */
  @LogAction('Undo action')
  async undo(): Promise<void> {
    await this.root.press('Control+z');
  }

  /**
   * Повторить действие
   */
  @LogAction('Redo action')
  async redo(): Promise<void> {
    await this.root.press('Control+y');
  }

  // ========== ПОЛУЧЕНИЕ ПОЛНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить полную информацию о поле ввода
   */
  @LogAction('Get input info')
  async getInputInfo(): Promise<{
    value: string;
    placeholder: string | null;
    isEnabled: boolean;
    isRequired: boolean;
    isValid: boolean;
    isEmpty: boolean;
    isFocused: boolean;
    errorMessage: string | null;
  }> {
    const [
      value,
      placeholder,
      isEnabled,
      isRequired,
      isValid,
      isEmpty,
      isFocused,
      errorMessage
    ] = await Promise.all([
      this.getValue(),
      this.getPlaceholder(),
      this.isEnabled(),
      this.isRequired(),
      this.isValid(),
      this.isEmpty(),
      this.isFocused(),
      this.getErrorMessage()
    ]);

    return {
      value,
      placeholder,
      isEnabled,
      isRequired,
      isValid,
      isEmpty,
      isFocused,
      errorMessage
    };
  }
}
