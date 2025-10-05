/**
 * Pagination Section Component
 * Компонент секции пагинации
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { PaginationButtonComponent } from '@components/atoms/pagination-button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class PaginationSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Pagination Section');
  }

  // ========== ЛОКАТОРЫ ==========

  get paginationButtons(): Locator {
    return this.root.locator('button, .pagination-button, .page-button');
  }

  get activeButton(): Locator {
    return this.root.locator('button.active, .pagination-button.active, .active');
  }

  get prevButton(): Locator {
    return this.root.locator('button.prev, .prev-button, .pagination-prev');
  }

  get nextButton(): Locator {
    return this.root.locator('button.next, .next-button, .pagination-next');
  }

  get firstButton(): Locator {
    return this.root.locator('button.first, .first-button, .pagination-first');
  }

  get lastButton(): Locator {
    return this.root.locator('button.last, .last-button, .pagination-last');
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
   * Получить кнопку пагинации по индексу
   */
  getPaginationButtonByIndex(index: number): PaginationButtonComponent {
    const button = this.paginationButtons.nth(index);
    return new PaginationButtonComponent(this.page, button);
  }

  /**
   * Получить кнопку пагинации по номеру страницы
   */
  getPaginationButtonByPage(pageNumber: number): PaginationButtonComponent {
    const button = this.paginationButtons.filter({ hasText: pageNumber.toString() });
    return new PaginationButtonComponent(this.page, button);
  }

  /**
   * Кликнуть на страницу по номеру
   */
  async clickPage(pageNumber: number): Promise<void> {
    logger.step(`Clicking page: ${pageNumber}`);
    const button = this.getPaginationButtonByPage(pageNumber);
    await button.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кнопку "Назад"
   */
  async clickPrev(): Promise<void> {
    logger.step('Clicking previous page');
    await this.prevButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на кнопку "Вперед"
   */
  async clickNext(): Promise<void> {
    logger.step('Clicking next page');
    await this.nextButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на первую страницу
   */
  async clickFirst(): Promise<void> {
    logger.step('Clicking first page');
    await this.firstButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на последнюю страницу
   */
  async clickLast(): Promise<void> {
    logger.step('Clicking last page');
    await this.lastButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить количество страниц
   */
  async getTotalPages(): Promise<number> {
    try {
      return await this.paginationButtons.count();
    } catch {
      return 0;
    }
  }

  /**
   * Получить активную страницу
   */
  async getActivePage(): Promise<string | null> {
    try {
      return await this.activeButton.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить номер активной страницы
   */
  async getActivePageNumber(): Promise<number | null> {
    try {
      const activeText = await this.getActivePage();
      return activeText ? parseInt(activeText, 10) : null;
    } catch {
      return null;
    }
  }

  /**
   * Получить все номера страниц
   */
  async getAllPageNumbers(): Promise<number[]> {
    try {
      const texts = await this.paginationButtons.allTextContents();
      return texts
        .map(text => parseInt(text, 10))
        .filter(num => !isNaN(num));
    } catch {
      return [];
    }
  }

  /**
   * Получить информацию о пагинации
   */
  async getPaginationInfo(): Promise<{
    totalPages: number;
    activePage: string | null;
    activePageNumber: number | null;
    allPageNumbers: number[];
  }> {
    const [totalPages, activePage, activePageNumber, allPageNumbers] = await Promise.all([
      this.getTotalPages(),
      this.getActivePage(),
      this.getActivePageNumber(),
      this.getAllPageNumbers()
    ]);

    return { totalPages, activePage, activePageNumber, allPageNumbers };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли секция пагинации
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли пагинация
   */
  async hasPagination(): Promise<boolean> {
    try {
      const count = await this.getTotalPages();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, отключена ли кнопка "Назад"
   */
  async isPrevDisabled(): Promise<boolean> {
    return await this.prevButton.isDisabled().catch(() => false);
  }

  /**
   * Проверить, отключена ли кнопка "Вперед"
   */
  async isNextDisabled(): Promise<boolean> {
    return await this.nextButton.isDisabled().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Первая"
   */
  async hasFirstButton(): Promise<boolean> {
    return await this.firstButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка "Последняя"
   */
  async hasLastButton(): Promise<boolean> {
    return await this.lastButton.isVisible().catch(() => false);
  }
}
