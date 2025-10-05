/**
 * Filters Service
 * Бизнес-логика для работы с фильтрами
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { FiltersSectionComponent } from '@pages/common/filters-section.component';
import { logger } from '@utils/logger.util';

export class FiltersService extends BaseService {
  private filtersSection: FiltersSectionComponent;

  constructor(page: Page) {
    super(page);
    this.filtersSection = new FiltersSectionComponent(page);
  }

  /**
   * Выполнить поиск
   */
  async search(query: string): Promise<void> {
    this.logStep('Searching', query);
    await this.filtersSection.search(query);
    await this.waitForNetworkIdle();
    this.logSuccess(`Search completed: ${query}`);
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<void> {
    this.logStep('Clearing search');
    await this.filtersSection.clearSearch();
    await this.waitForNetworkIdle();
    this.logSuccess('Search cleared');
  }

  /**
   * Получить текущий поисковый запрос
   */
  async getSearchQuery(): Promise<string> {
    this.logStep('Getting search query');
    const query = await this.filtersSection.getSearchQuery();
    this.logSuccess(`Current search query: ${query}`);
    return query;
  }

  /**
   * Кликнуть на фильтр по названию
   */
  async clickFilter(filterName: string): Promise<void> {
    this.logStep('Clicking filter', filterName);
    await this.filtersSection.clickFilter(filterName);
    await this.waitForNetworkIdle();
    this.logSuccess(`Filter applied: ${filterName}`);
  }

  /**
   * Кликнуть на фильтр по индексу
   */
  async clickFilterByIndex(index: number): Promise<void> {
    this.logStep('Clicking filter by index', index.toString());
    await this.filtersSection.clickFilterByIndex(index);
    await this.waitForNetworkIdle();
    this.logSuccess(`Filter applied at index: ${index}`);
  }

  /**
   * Получить активный фильтр
   */
  async getActiveFilter(): Promise<string | null> {
    this.logStep('Getting active filter');
    const activeFilter = await this.filtersSection.getActiveFilter();
    this.logSuccess(`Active filter: ${activeFilter || 'None'}`);
    return activeFilter;
  }

  /**
   * Получить все доступные фильтры
   */
  async getAllFilters(): Promise<string[]> {
    this.logStep('Getting all filters');
    const filters = await this.filtersSection.getAllFilters();
    this.logSuccess(`Found ${filters.length} filters`);
    return filters;
  }

  /**
   * Выбрать опцию из выпадающего списка
   */
  async selectDropdownOption(option: string): Promise<void> {
    this.logStep('Selecting dropdown option', option);
    await this.filtersSection.selectDropdownOption(option);
    await this.waitForNetworkIdle();
    this.logSuccess(`Dropdown option selected: ${option}`);
  }

  /**
   * Получить опции выпадающего списка
   */
  async getDropdownOptions(): Promise<string[]> {
    this.logStep('Getting dropdown options');
    const options = await this.filtersSection.getDropdownOptions();
    this.logSuccess(`Found ${options.length} dropdown options`);
    return options;
  }

  /**
   * Проверить, есть ли поле поиска
   */
  async hasSearchInput(): Promise<boolean> {
    return await this.filtersSection.hasSearchInput();
  }

  /**
   * Проверить, есть ли выпадающий список
   */
  async hasDropdown(): Promise<boolean> {
    return await this.filtersSection.hasDropdown();
  }

  /**
   * Проверить, есть ли активный фильтр
   */
  async hasActiveFilter(): Promise<boolean> {
    return await this.filtersSection.hasActiveFilter();
  }

  /**
   * Получить количество фильтров
   */
  async getFiltersCount(): Promise<number> {
    this.logStep('Getting filters count');
    const count = await this.filtersSection.getFiltersCount();
    this.logSuccess(`Filters count: ${count}`);
    return count;
  }

  /**
   * Проверить, видима ли секция фильтров
   */
  async isVisible(): Promise<boolean> {
    return await this.filtersSection.isVisible();
  }

  /**
   * Дождаться загрузки фильтров
   */
  async waitForLoad(): Promise<void> {
    this.logStep('Waiting for filters to load');
    await this.filtersSection.waitForLoad();
    this.logSuccess('Filters loaded');
  }
}
