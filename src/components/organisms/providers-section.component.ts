/**
 * Providers Section Component
 * Компонент секции провайдеров
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { ProviderCardComponent } from '@components/atoms/provider-card.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class ProvidersSectionComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Providers Section');
  }

  // ========== ЛОКАТОРЫ ==========

  get providersGrid(): Locator {
    return this.root.locator('.providers-grid, .vendors-grid, .grid');
  }

  get providerCard(): Locator {
    return this.root.locator('.provider-card, .vendor-card, .provider, .vendor');
  }

  get title(): Locator {
    return this.root.locator('h2, .section-title, .title');
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
   * Получить карточку провайдера по индексу
   */
  getProviderCardByIndex(index: number): ProviderCardComponent {
    const card = this.providerCard.nth(index);
    return new ProviderCardComponent(this.page, card);
  }

  /**
   * Получить карточку провайдера по названию
   */
  getProviderCardByName(name: string): ProviderCardComponent {
    const card = this.providerCard.filter({ hasText: name });
    return new ProviderCardComponent(this.page, card);
  }

  /**
   * Кликнуть на провайдера по индексу
   */
  async clickProvider(index: number): Promise<void> {
    logger.step(`Clicking provider at index: ${index}`);
    const providerCard = this.getProviderCardByIndex(index);
    await providerCard.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Кликнуть на провайдера по названию
   */
  async clickProviderByName(name: string): Promise<void> {
    logger.step(`Clicking provider: ${name}`);
    const providerCard = this.getProviderCardByName(name);
    await providerCard.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Навести курсор на провайдера по индексу
   */
  async hoverProvider(index: number): Promise<void> {
    logger.step(`Hovering over provider at index: ${index}`);
    const providerCard = this.getProviderCardByIndex(index);
    await providerCard.hover();
  }

  /**
   * Навести курсор на провайдера по названию
   */
  async hoverProviderByName(name: string): Promise<void> {
    logger.step(`Hovering over provider: ${name}`);
    const providerCard = this.getProviderCardByName(name);
    await providerCard.hover();
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить количество провайдеров
   */
  async getProvidersCount(): Promise<number> {
    try {
      return await this.providerCard.count();
    } catch {
      return 0;
    }
  }

  /**
   * Получить название провайдера по индексу
   */
  async getProviderName(index: number): Promise<string | null> {
    const providerCard = this.getProviderCardByIndex(index);
    return await providerCard.getName();
  }

  /**
   * Получить все названия провайдеров
   */
  async getAllProviderNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.getProvidersCount();
    
    for (let i = 0; i < count; i++) {
      const name = await this.getProviderName(i);
      if (name) {
        names.push(name);
      }
    }
    
    return names;
  }

  /**
   * Получить информацию о провайдере по индексу
   */
  async getProviderInfo(index: number): Promise<{
    name: string | null;
    imageSrc: string | null;
    gamesCount: string | null;
  }> {
    const providerCard = this.getProviderCardByIndex(index);
    return await providerCard.getProviderInfo();
  }

  /**
   * Получить информацию о всех провайдерах
   */
  async getAllProvidersInfo(): Promise<Array<{
    name: string | null;
    imageSrc: string | null;
    gamesCount: string | null;
    index: number;
  }>> {
    const providers: Array<{
      name: string | null;
      imageSrc: string | null;
      gamesCount: string | null;
      index: number;
    }> = [];
    const count = await this.getProvidersCount();
    
    for (let i = 0; i < count; i++) {
      const info = await this.getProviderInfo(i);
      providers.push({ ...info, index: i });
    }
    
    return providers;
  }

  /**
   * Получить заголовок секции
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видима ли секция провайдеров
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible().catch(() => false);
  }

  /**
   * Проверить, загружены ли провайдеры
   */
  async areProvidersLoaded(): Promise<boolean> {
    try {
      const count = await this.getProvidersCount();
      return count > 0;
    } catch {
      return false;
    }
  }
}
