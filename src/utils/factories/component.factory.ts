/**
 * Component Factory
 * Фабрика для создания компонентов с кэшированием и валидацией
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../components/base/base.component';
import { logger } from '../core/logger';

export interface ComponentConfig {
  selector: string;
  name: string;
  timeout?: number;
  retries?: number;
}

export interface ComponentCache {
  [key: string]: BaseComponent;
}

export class ComponentFactory {
  private static cache: ComponentCache = {};
  private static pageCache: Map<Page, ComponentCache> = new Map();

  /**
   * Создать или получить из кэша компонент
   */
  static create<T extends BaseComponent>(
    ComponentClass: new (page: Page, root: Locator, name: string) => T,
    page: Page,
    config: ComponentConfig
  ): T {
    const cacheKey = `${config.selector}-${config.name}`;
    
    // Проверяем кэш для конкретной страницы
    if (!this.pageCache.has(page)) {
      this.pageCache.set(page, {});
    }
    
    const pageCache = this.pageCache.get(page)!;
    
    if (pageCache[cacheKey]) {
      logger.debug(`Using cached component: ${config.name}`);
      return pageCache[cacheKey] as T;
    }

    // Создаем новый компонент
    const root = page.locator(config.selector);
    const component = new ComponentClass(page, root, config.name);
    
    // Кэшируем компонент
    pageCache[cacheKey] = component;
    
    logger.debug(`Created new component: ${config.name}`);
    return component;
  }

  /**
   * Очистить кэш для страницы
   */
  static clearPageCache(page: Page): void {
    this.pageCache.delete(page);
    logger.debug('Cleared page cache');
  }

  /**
   * Очистить весь кэш
   */
  static clearAllCache(): void {
    this.cache = {};
    this.pageCache.clear();
    logger.debug('Cleared all cache');
  }

  /**
   * Получить статистику кэша
   */
  static getCacheStats(): { totalPages: number; totalComponents: number } {
    let totalComponents = 0;
    this.pageCache.forEach(cache => {
      totalComponents += Object.keys(cache).length;
    });
    
    return {
      totalPages: this.pageCache.size,
      totalComponents
    };
  }
}
