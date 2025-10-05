/**
 * Search Input Atom
 * Атомарный компонент для поля поиска
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';

export class SearchInputComponent extends BaseComponent {
  constructor(page: Page, searchInput: Locator) {
    super(page, searchInput, 'Search Input');
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
    logger.success('Search input component loaded');
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Ввести текст в поле поиска
   */
  async fill(text: string): Promise<void> {
    logger.step(`Filling search input with: ${text}`);
    await this.root.clear();
    await this.root.fill(text);
  }

  /**
   * Очистить поле поиска
   */
  async clear(): Promise<void> {
    logger.step('Clearing search input');
    await this.root.clear();
  }

  /**
   * Кликнуть на поле поиска
   */
  async click(): Promise<void> {
    logger.step('Clicking search input');
    await this.root.click();
  }

  /**
   * Навести курсор на поле поиска
   */
  async hover(): Promise<void> {
    logger.step('Hovering over search input');
    await this.root.hover();
  }

  /**
   * Нажать Enter в поле поиска
   */
  async pressEnter(): Promise<void> {
    logger.step('Pressing Enter in search input');
    await this.root.press('Enter');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить текущее значение поля
   */
  async getValue(): Promise<string> {
    try {
      return await this.root.inputValue();
    } catch {
      return '';
    }
  }

  /**
   * Получить placeholder
   */
  async getPlaceholder(): Promise<string | null> {
    try {
      return await this.root.getAttribute('placeholder');
    } catch {
      return null;
    }
  }

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
   * Проверить, активно ли поле
   */
  async isFocused(): Promise<boolean> {
    return await this.root.evaluate((el) => el === document.activeElement).catch(() => false);
  }

  /**
   * Проверить, отключено ли поле
   */
  async isDisabled(): Promise<boolean> {
    return await this.root.isDisabled().catch(() => false);
  }

  /**
   * Проверить, пустое ли поле
   */
  async isEmpty(): Promise<boolean> {
    const value = await this.getValue();
    return value.trim() === '';
  }
}
