/**
 * Category Page
 * Универсальная страница для всех категорий игр
 * Использует композицию компонентов для разных секций
 */

import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { BannerSectionComponent } from '../../components/sections/banner-section.component';
import { GamesSectionComponent } from '../../components/sections/games-section.component';
import { FiltersSectionComponent } from '../../components/sections/filters-section.component';
import { ProvidersSectionComponent } from '../../components/sections/providers-section.component';
import { PaginationSectionComponent } from '../../components/sections/pagination-section.component';
import { LoadingStateComponent } from '../../components/states/loading-state.component';
import { EmptyStateComponent } from '../../components/states/empty-state.component';
import { ErrorStateComponent } from '../../components/states/error-state.component';
import { logger } from '../../utils/core/logger';
import { TIMEOUTS } from '../../config/constants';

export class CategoryPage extends BasePage {
  protected pageName = 'Category Page';

  // ========== КОМПОНЕНТЫ СЕКЦИЙ ==========

  get bannerSection(): BannerSectionComponent {
    return new BannerSectionComponent(this.page);
  }

  get gamesSection(): GamesSectionComponent {
    return new GamesSectionComponent(this.page);
  }

  get filtersSection(): FiltersSectionComponent {
    return new FiltersSectionComponent(this.page);
  }

  get providersSection(): ProvidersSectionComponent {
    return new ProvidersSectionComponent(this.page);
  }

  get paginationSection(): PaginationSectionComponent {
    return new PaginationSectionComponent(this.page);
  }

  // ========== КОМПОНЕНТЫ СОСТОЯНИЙ ==========

  get loadingState(): LoadingStateComponent {
    return new LoadingStateComponent(this.page);
  }

  get emptyState(): EmptyStateComponent {
    return new EmptyStateComponent(this.page);
  }

  get errorState(): ErrorStateComponent {
    return new ErrorStateComponent(this.page);
  }

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.page.locator('main.page_content, .main-content, .page-content').isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForLoad(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    logger.debug(`Waiting for ${this.constructor.name} to load`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator('main.page_content, .main-content, .page-content').waitFor({ state: 'visible', timeout });
    logger.success(`${this.constructor.name} loaded`);
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, загружены ли игры
   */
  async areGamesLoaded(): Promise<boolean> {
    return await this.gamesSection.areGamesLoaded();
  }

  /**
   * Проверить, идет ли загрузка
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingState.isLoading();
  }

  /**
   * Проверить, есть ли пустое состояние
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isEmpty();
  }

  /**
   * Проверить, есть ли ошибка
   */
  async hasError(): Promise<boolean> {
    return await this.errorState.hasError();
  }

  /**
   * Проверить, есть ли пагинация
   */
  async hasPagination(): Promise<boolean> {
    return await this.paginationSection.hasPagination();
  }

  // ========== ОЖИДАНИЕ ЗАГРУЗКИ ==========

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    await this.gamesSection.waitForGamesLoad();
  }

  /**
   * Дождаться завершения загрузки
   */
  async waitForLoadingComplete(): Promise<void> {
    await this.loadingState.waitForLoadingComplete();
  }
}
