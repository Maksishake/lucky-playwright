/**
 * Pagination Service
 * Бизнес-логика для работы с пагинацией
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { PaginationSectionComponent } from '@pages/common/pagination-section.component';
import { logger } from '@utils/logger.util';

export class PaginationService extends BaseService {
  private paginationSection: PaginationSectionComponent;

  constructor(page: Page) {
    super(page);
    this.paginationSection = new PaginationSectionComponent(page);
  }

  /**
   * Перейти на следующую страницу
   */
  async goToNextPage(): Promise<void> {
    this.logStep('Going to next page');
    await this.paginationSection.clickNext();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to next page');
  }

  /**
   * Перейти на предыдущую страницу
   */
  async goToPrevPage(): Promise<void> {
    this.logStep('Going to previous page');
    await this.paginationSection.clickPrev();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to previous page');
  }

  /**
   * Перейти на первую страницу
   */
  async goToFirstPage(): Promise<void> {
    this.logStep('Going to first page');
    await this.paginationSection.clickFirst();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to first page');
  }

  /**
   * Перейти на последнюю страницу
   */
  async goToLastPage(): Promise<void> {
    this.logStep('Going to last page');
    await this.paginationSection.clickLast();
    await this.waitForNetworkIdle();
    this.logSuccess('Navigated to last page');
  }

  /**
   * Перейти на конкретную страницу
   */
  async goToPage(pageNumber: number): Promise<void> {
    this.logStep('Going to page', pageNumber.toString());
    await this.paginationSection.clickPage(pageNumber);
    await this.waitForNetworkIdle();
    this.logSuccess(`Navigated to page ${pageNumber}`);
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
    this.logStep('Getting pagination info');
    const info = await this.paginationSection.getPaginationInfo();
    this.logSuccess(`Pagination info: ${info.totalPages} pages, active: ${info.activePageNumber}`);
    return info;
  }

  /**
   * Получить общее количество страниц
   */
  async getTotalPages(): Promise<number> {
    this.logStep('Getting total pages');
    const totalPages = await this.paginationSection.getTotalPages();
    this.logSuccess(`Total pages: ${totalPages}`);
    return totalPages;
  }

  /**
   * Получить активную страницу
   */
  async getActivePage(): Promise<string | null> {
    this.logStep('Getting active page');
    const activePage = await this.paginationSection.getActivePage();
    this.logSuccess(`Active page: ${activePage || 'None'}`);
    return activePage;
  }

  /**
   * Получить номер активной страницы
   */
  async getActivePageNumber(): Promise<number | null> {
    this.logStep('Getting active page number');
    const activePageNumber = await this.paginationSection.getActivePageNumber();
    this.logSuccess(`Active page number: ${activePageNumber || 'None'}`);
    return activePageNumber;
  }

  /**
   * Получить все номера страниц
   */
  async getAllPageNumbers(): Promise<number[]> {
    this.logStep('Getting all page numbers');
    const pageNumbers = await this.paginationSection.getAllPageNumbers();
    this.logSuccess(`Page numbers: ${pageNumbers.join(', ')}`);
    return pageNumbers;
  }

  /**
   * Проверить, есть ли пагинация
   */
  async hasPagination(): Promise<boolean> {
    return await this.paginationSection.hasPagination();
  }

  /**
   * Проверить, отключена ли кнопка "Назад"
   */
  async isPrevDisabled(): Promise<boolean> {
    return await this.paginationSection.isPrevDisabled();
  }

  /**
   * Проверить, отключена ли кнопка "Вперед"
   */
  async isNextDisabled(): Promise<boolean> {
    return await this.paginationSection.isNextDisabled();
  }

  /**
   * Проверить, есть ли кнопка "Первая"
   */
  async hasFirstButton(): Promise<boolean> {
    return await this.paginationSection.hasFirstButton();
  }

  /**
   * Проверить, есть ли кнопка "Последняя"
   */
  async hasLastButton(): Promise<boolean> {
    return await this.paginationSection.hasLastButton();
  }

  /**
   * Проверить, видима ли секция пагинации
   */
  async isVisible(): Promise<boolean> {
    return await this.paginationSection.isVisible();
  }

  /**
   * Дождаться загрузки пагинации
   */
  async waitForLoad(): Promise<void> {
    this.logStep('Waiting for pagination to load');
    await this.paginationSection.waitForLoad();
    this.logSuccess('Pagination loaded');
  }
}
