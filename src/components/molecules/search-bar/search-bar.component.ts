/**
 * Search Bar Component - Molecule
 * Молекула: комбинация SearchInput + FilterButton
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { SearchInputComponent } from '@components/atoms/search-input.component';
import { FilterButtonComponent } from '@components/atoms/filter-button.component';

export class SearchBarComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  private searchInput: SearchInputComponent;
  private filterButton: FilterButtonComponent;

  constructor(page: Page, root: Locator, componentName: string = 'Search Bar') {
    super(page, root, componentName);
    
    // Инициализация атомов
    this.searchInput = new SearchInputComponent(
      page, 
      root.locator('.search-input, input[type="search"], input[placeholder*="search" i]')
    );
    
    this.filterButton = new FilterButtonComponent(
      page, 
      root.locator('.filter-button, button:has-text("Filter"), button:has-text("Фильтр")')
    );
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость поисковой панели
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку поисковой панели
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible() && await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки поисковой панели
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== ДЕЙСТВИЯ ==========

  /**
   * Кликнуть на поисковую панель
   */
  @LogAction('Click search bar')
  @ValidateState()
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Навести курсор на поисковую панель
   */
  @LogAction('Hover search bar')
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /**
   * Выполнить поиск
   */
  @LogAction('Perform search')
  @ValidateState()
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.pressEnter();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Очистить поиск
   */
  @LogAction('Clear search')
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Применить фильтр
   */
  @LogAction('Apply filter')
  @ValidateState()
  async applyFilter(): Promise<void> {
    await this.filterButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Сбросить фильтры
   */
  @LogAction('Reset filters')
  async resetFilters(): Promise<void> {
    await this.filterButton.click();
    await this.clearSearch();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить текст поискового запроса
   */
  @LogAction('Get search query')
  async getText(): Promise<string> {
    return await this.searchInput.getValue();
  }

  /**
   * Получить placeholder поиска
   */
  async getSearchPlaceholder(): Promise<string | null> {
    return await this.searchInput.getPlaceholder();
  }

  /**
   * Получить текст кнопки фильтра
   */
  async getFilterButtonText(): Promise<string> {
    return await this.filterButton.getText();
  }

  /**
   * Получить атрибут поисковой панели
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
   * Проверить активность поисковой панели
   */
  async isEnabled(): Promise<boolean> {
    try {
      return await this.root.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить отключенность поисковой панели
   */
  async isDisabled(): Promise<boolean> {
    try {
      return await this.root.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, пустое ли поле поиска
   */
  async isSearchEmpty(): Promise<boolean> {
    return await this.searchInput.isEmpty();
  }

  /**
   * Проверить, активно ли поле поиска
   */
  async isSearchFocused(): Promise<boolean> {
    return await this.searchInput.isFocused();
  }

  /**
   * Проверить, активен ли фильтр
   */
  async isFilterActive(): Promise<boolean> {
    return await this.filterButton.isActive();
  }

  /**
   * Проверить наличие поискового поля
   */
  async hasSearchInput(): Promise<boolean> {
    return await this.searchInput.isVisible();
  }

  /**
   * Проверить наличие кнопки фильтра
   */
  async hasFilterButton(): Promise<boolean> {
    return await this.filterButton.isVisible();
  }

  // ========== ПОЛУЧЕНИЕ КОМПОНЕНТОВ ==========

  /**
   * Получить компонент поискового поля
   */
  getSearchInput(): SearchInputComponent {
    return this.searchInput;
  }

  /**
   * Получить компонент кнопки фильтра
   */
  getFilterButton(): FilterButtonComponent {
    return this.filterButton;
  }

  // ========== ПОЛУЧЕНИЕ ПОЛНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить полную информацию о поисковой панели
   */
  @LogAction('Get search bar info')
  async getSearchBarInfo(): Promise<{
    searchQuery: string;
    searchPlaceholder: string | null;
    filterButtonText: string;
    isSearchEmpty: boolean;
    isSearchFocused: boolean;
    isFilterActive: boolean;
    hasSearchInput: boolean;
    hasFilterButton: boolean;
  }> {
    const [
      searchQuery,
      searchPlaceholder,
      filterButtonText,
      isSearchEmpty,
      isSearchFocused,
      isFilterActive,
      hasSearchInput,
      hasFilterButton
    ] = await Promise.all([
      this.getText(),
      this.getSearchPlaceholder(),
      this.getFilterButtonText(),
      this.isSearchEmpty(),
      this.isSearchFocused(),
      this.isFilterActive(),
      this.hasSearchInput(),
      this.hasFilterButton()
    ]);

    return {
      searchQuery,
      searchPlaceholder,
      filterButtonText,
      isSearchEmpty,
      isSearchFocused,
      isFilterActive,
      hasSearchInput,
      hasFilterButton
    };
  }
}