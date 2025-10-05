/**
 * Icon Component - Atom
 * Атомарный компонент иконки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';

export class IconComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  constructor(page: Page, root: Locator, componentName: string = 'Icon') {
    super(page, root, componentName);
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость иконки
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку иконки
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки иконки
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на иконку
   */
  @LogAction('Click icon')
  @ValidateState()
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Навести курсор на иконку
   */
  @LogAction('Hover icon')
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /**
   * Получить текст иконки
   */
  @LogAction('Get icon text')
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить атрибут иконки
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
   * Проверить активность иконки
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность иконки
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  // ========== СПЕЦИАЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Получить класс иконки
   */
  @LogAction('Get icon class')
  async getIconClass(): Promise<string | null> {
    return await this.getAttribute('class');
  }

  /**
   * Получить название иконки
   */
  @LogAction('Get icon name')
  async getIconName(): Promise<string | null> {
    return await this.getAttribute('data-icon') || await this.getAttribute('name');
  }

  /**
   * Получить размер иконки
   */
  @LogAction('Get icon size')
  async getIconSize(): Promise<string | null> {
    return await this.getAttribute('data-size') || await this.getAttribute('size');
  }

  /**
   * Получить цвет иконки
   */
  @LogAction('Get icon color')
  async getIconColor(): Promise<string | null> {
    return await this.getAttribute('data-color') || await this.getAttribute('color');
  }

  /**
   * Проверить, является ли иконка активной
   */
  async isActive(): Promise<boolean> {
    try {
      const classList = await this.getIconClass();
      return classList?.includes('active') || classList?.includes('selected') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли иконка загружающейся
   */
  async isLoading(): Promise<boolean> {
    try {
      const classList = await this.getIconClass();
      return classList?.includes('loading') || classList?.includes('spinner') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли иконка ошибкой
   */
  async isError(): Promise<boolean> {
    try {
      const classList = await this.getIconClass();
      return classList?.includes('error') || classList?.includes('danger') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли иконка успехом
   */
  async isSuccess(): Promise<boolean> {
    try {
      const classList = await this.getIconClass();
      return classList?.includes('success') || classList?.includes('check') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли иконка предупреждением
   */
  async isWarning(): Promise<boolean> {
    try {
      const classList = await this.getIconClass();
      return classList?.includes('warning') || classList?.includes('alert') || false;
    } catch {
      return false;
    }
  }

  /**
   * Получить информацию об иконке
   */
  @LogAction('Get icon info')
  async getIconInfo(): Promise<{
    text: string;
    class: string | null;
    name: string | null;
    size: string | null;
    color: string | null;
    isActive: boolean;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    isWarning: boolean;
  }> {
    const [
      text,
      classList,
      name,
      size,
      color,
      isActive,
      isLoading,
      isError,
      isSuccess,
      isWarning
    ] = await Promise.all([
      this.getText(),
      this.getIconClass(),
      this.getIconName(),
      this.getIconSize(),
      this.getIconColor(),
      this.isActive(),
      this.isLoading(),
      this.isError(),
      this.isSuccess(),
      this.isWarning()
    ]);

    return {
      text,
      class: classList,
      name,
      size,
      color,
      isActive,
      isLoading,
      isError,
      isSuccess,
      isWarning
    };
  }
}
