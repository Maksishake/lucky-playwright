/**
 * Filter Button Atom
 * Атомарный компонент для кнопки фильтра
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';

export class FilterButtonComponent extends BaseComponent {
  constructor(page: Page, filterButton: Locator) {
    super(page, filterButton, 'Filter Button');
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
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: 5000 });
    logger.success('Filter button component loaded');
  }

  /**
   * Получить текст кнопки
   */
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на кнопку фильтра
   */
  async click(): Promise<void> {
    logger.step('Clicking filter button');
    await this.root.scrollIntoViewIfNeeded();
    await this.root.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на кнопку
   */
  async hover(): Promise<void> {
    logger.step('Hovering over filter button');
    await this.root.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========


  /**
   * Получить значение атрибута
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
   * Проверить, активна ли кнопка
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
   * Проверить, отключена ли кнопка
   */
  async isDisabled(): Promise<boolean> {
    return await this.root.isDisabled().catch(() => false);
  }
}
