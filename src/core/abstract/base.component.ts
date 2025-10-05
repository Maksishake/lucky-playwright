/**
 * Base Component - Abstract Class
 * Абстрактный базовый класс для всех компонентов
 */

import { Page, Locator } from '@playwright/test';
import { IComponent } from '@core/interfaces/component.interface';
import { logger } from '@utils/logger.util';

export abstract class BaseComponent implements IComponent {
  public page: Page;
  public root: Locator;
  public componentName: string;

  constructor(page: Page, root: Locator, componentName: string) {
    this.page = page;
    this.root = root;
    this.componentName = componentName;
  }

  /**
   * Проверить видимость компонента
   */
  abstract isVisible(): Promise<boolean>;

  /**
   * Проверить загрузку компонента
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Дождаться загрузки компонента
   */
  abstract waitForLoad(): Promise<void>;

  /**
   * Кликнуть на компонент
   */
  async click(): Promise<void> {
    logger.step(`Clicking ${this.componentName}`);
    await this.root.click();
  }

  /**
   * Навести курсор на компонент
   */
  async hover(): Promise<void> {
    logger.step(`Hovering over ${this.componentName}`);
    await this.root.hover();
  }

  /**
   * Получить текст компонента
   */
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить атрибут компонента
   */
  async getAttribute(name: string): Promise<string | null> {
    try {
      return await this.root.getAttribute(name);
    } catch {
      return null;
    }
  }

  /**
   * Проверить активность компонента
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность компонента
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Скролл к компоненту
   */
  async scrollIntoView(): Promise<void> {
    logger.step(`Scrolling to ${this.componentName}`);
    await this.root.scrollIntoViewIfNeeded();
  }

  /**
   * Дождаться видимости компонента
   */
  async waitForVisible(timeout?: number): Promise<void> {
    logger.step(`Waiting for ${this.componentName} to be visible`);
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /**
   * Дождаться скрытия компонента
   */
  async waitForHidden(timeout?: number): Promise<void> {
    logger.step(`Waiting for ${this.componentName} to be hidden`);
    await this.root.waitFor({ state: 'hidden', timeout });
  }
}
