/**
 * Spinner Component - Atom
 * Атомарный компонент спиннера загрузки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';

export class SpinnerComponent extends BaseComponent implements IComponent {
  constructor(page: Page, root: Locator, componentName: string = 'Spinner') {
    super(page, root, componentName);
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость спиннера
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку спиннера
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки спиннера
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, активен ли спиннер
   */
  async isActive(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('active') || classList?.includes('loading') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, анимирован ли спиннер
   */
  async isAnimated(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('animate') || classList?.includes('spinning') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли спиннер кнопочным
   */
  async isButtonSpinner(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('btn-spinner') || classList?.includes('button-spinner') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли спиннер полноэкранным
   */
  async isFullscreen(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('fullscreen') || classList?.includes('overlay') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли спиннер маленьким
   */
  async isSmall(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('small') || classList?.includes('sm') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли спиннер большим
   */
  async isLarge(): Promise<boolean> {
    try {
      const classList = await this.root.getAttribute('class');
      return classList?.includes('large') || classList?.includes('lg') || false;
    } catch {
      return false;
    }
  }

  /**
   * Получить размер спиннера
   */
  @LogAction('Get spinner size')
  async getSpinnerSize(): Promise<string | null> {
    return await this.root.getAttribute('data-size') || await this.root.getAttribute('data-spinner-size');
  }

  /**
   * Получить цвет спиннера
   */
  @LogAction('Get spinner color')
  async getSpinnerColor(): Promise<string | null> {
    return await this.root.getAttribute('data-color') || await this.root.getAttribute('data-spinner-color');
  }

  /**
   * Получить тип спиннера
   */
  @LogAction('Get spinner type')
  async getSpinnerType(): Promise<string | null> {
    return await this.root.getAttribute('data-type') || await this.root.getAttribute('data-spinner-type');
  }

  /**
   * Получить текст спиннера
   */
  @LogAction('Get spinner text')
  async getSpinnerText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Дождаться исчезновения спиннера
   */
  @LogAction('Wait for spinner to disappear')
  async waitForDisappear(timeout: number = 10000): Promise<void> {
    try {
      await this.root.waitFor({ state: 'hidden', timeout });
    } catch (error) {
      // Игнорируем таймаут - спиннер может не исчезнуть
    }
  }

  /**
   * Получить информацию о спиннере
   */
  @LogAction('Get spinner info')
  async getSpinnerInfo(): Promise<{
    text: string;
    size: string | null;
    color: string | null;
    type: string | null;
    isActive: boolean;
    isAnimated: boolean;
    isButtonSpinner: boolean;
    isFullscreen: boolean;
    isSmall: boolean;
    isLarge: boolean;
  }> {
    const [
      text,
      size,
      color,
      type,
      isActive,
      isAnimated,
      isButtonSpinner,
      isFullscreen,
      isSmall,
      isLarge
    ] = await Promise.all([
      this.getSpinnerText(),
      this.getSpinnerSize(),
      this.getSpinnerColor(),
      this.getSpinnerType(),
      this.isActive(),
      this.isAnimated(),
      this.isButtonSpinner(),
      this.isFullscreen(),
      this.isSmall(),
      this.isLarge()
    ]);

    return {
      text,
      size,
      color,
      type,
      isActive,
      isAnimated,
      isButtonSpinner,
      isFullscreen,
      isSmall,
      isLarge
    };
  }
}
