/**
 * Filters Section Component
 * Компонент секции фильтров
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { FilterButtonComponent } from '@components/atoms/filter-button.component';
import { SearchInputComponent } from '@components/atoms/search-input.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class FiltersSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Filters Section');
  }

  // ========== ЛОКАТОРЫ ==========

  get filterButtons(): Locator {
    return this.root.locator('button, .filter-button, .filter-btn');
  }

  get activeFilter(): Locator {
    return this.root.locator('button.active, .filter-button.active, .active');
  }

  get searchInput(): Locator {
    return this.root.locator('input[type="search"], input[type="text"], .search-input');
  }

  get searchButton(): Locator {
    return this.root.locator('button[type="submit"], .search-button, .search-btn');
  }

  get dropdown(): Locator {
    return this.root.locator('select, .filter-dropdown, .dropdown');
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  /**
   * Получить кнопку фильтра по индексу
   */
  getFilterButtonByIndex(index: number): FilterButtonComponent {
    const button = this.filterButtons.nth(index);
    return new FilterButtonComponent(this.page, button);
  }

  /**
   * Получить кнопку фильтра по тексту
   */
  getFilterButtonByText(text: string): FilterButtonComponent {
    const button = this.filterButtons.filter({ hasText: text });
    return new FilterButtonComponent(this.page, button);
  }

  /**
   * Получить поле поиска
   */
  getSearchInput(): SearchInputComponent {
    return new SearchInputComponent(this.page, this.searchInput);
  }

  /**
   * Кликнуть на фильтр по тексту
   */
  async clickFilter(filterText: string): Promise<void> {
    logger.step(`Clicking filter: ${filterText}`);
    const filterButton = this.getFilterButtonByText(filterText);
    await filterButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на фильтр по индексу
   */
  async clickFilterByIndex(index: number): Promise<void> {
    logger.step(`Clicking filter at index: ${index}`);
    const filterButton = this.getFilterButtonByIndex(index);
    await filterButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Выполнить поиск
   */
  async search(query: string): Promise<void> {
    logger.step(`Searching for: ${query}`);
    const searchInput = this.getSearchInput();
    await searchInput.fill(query);
    await searchInput.pressEnter();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<void> {
    logger.step('Clearing search');
    const searchInput = this.getSearchInput();
    await searchInput.clear();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Выбрать опцию из выпадающего списка
   */
  async selectDropdownOption(value: string): Promise<void> {
    logger.step(`Selecting dropdown option: ${value}`);
    await this.dropdown.selectOption(value);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить количество фильтров
   */
  async getFiltersCount(): Promise<number> {
    try {
      return await this.filterButtons.count();
    } catch {
      return 0;
    }
  }

  /**
   * Получить активный фильтр
   */
  async getActiveFilter(): Promise<string | null> {
    try {
      return await this.activeFilter.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить все фильтры
   */
  async getAllFilters(): Promise<string[]> {
    try {
      return await this.filterButtons.allTextContents();
    } catch {
      return [];
    }
  }

  /**
   * Получить текущий поисковый запрос
   */
  async getSearchQuery(): Promise<string> {
    const searchInput = this.getSearchInput();
    return await searchInput.getValue();
  }

  /**
   * Получить опции выпадающего списка
   */
  async getDropdownOptions(): Promise<string[]> {
    try {
      return await this.dropdown.evaluate((select: HTMLSelectElement) => 
        Array.from(select.options).map(option => option.textContent || '')
      );
    } catch {
      return [];
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли секция фильтров
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли поле поиска
   */
  async hasSearchInput(): Promise<boolean> {
    return await this.searchInput.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли выпадающий список
   */
  async hasDropdown(): Promise<boolean> {
    return await this.dropdown.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли активный фильтр
   */
  async hasActiveFilter(): Promise<boolean> {
    return await this.activeFilter.isVisible().catch(() => false);
  }
}
