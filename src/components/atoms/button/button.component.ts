/**
 * Button Component - Atom
 * Атомарный компонент кнопки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';

export class ButtonComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  constructor(page: Page, root: Locator, componentName: string = 'Button') {
    super(page, root, componentName);
  }

  /**
   * Проверить видимость кнопки
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку кнопки
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки кнопки
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  /**
   * Кликнуть на кнопку
   */
  @LogAction('Click button')
  @ValidateState()
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Навести курсор на кнопку
   */
  @LogAction('Hover button')
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /**
   * Получить текст кнопки
   */
  @LogAction('Get button text')
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить атрибут кнопки
   */
  async getAttribute(name: string): Promise<string | null> {
    try {
      return await this.root.getAttribute(name);
    } catch {
      return null;
    }
  }

  /**
   * Проверить активность кнопки
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность кнопки
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли кнопка активной
   */
  async isActive(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('active') || false;
    } catch {
      return false;
    }
  }

  /**
   * Получить тип кнопки
   */
  async getButtonType(): Promise<string | null> {
    return await this.getAttribute('type');
  }

  /**
   * Получить информацию о кнопке
   */
  async getButtonInfo(): Promise<{
    text: string;
    isEnabled: boolean;
    isActive: boolean;
    type: string | null;
  }> {
    const [text, isEnabled, isActive, type] = await Promise.all([
      this.getText(),
      this.isEnabled(),
      this.isActive(),
      this.getButtonType()
    ]);

    return { text, isEnabled, isActive, type };
  }
}
