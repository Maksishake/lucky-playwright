/**
 * Base Page - Abstract Class
 * Абстрактный базовый класс для всех страниц
 */

import { Page } from '@playwright/test';
import { logger } from '@utils/logger.util';

export abstract class BasePage {
  protected page: Page;
  protected url: string;
  protected pageName: string;

  constructor(page: Page, url: string, pageName: string) {
    this.page = page;
    this.url = url;
    this.pageName = pageName;
  }

  /**
   * Перейти на страницу
   */
  abstract navigate(): Promise<void>;

  /**
   * Проверить загрузку страницы
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Дождаться загрузки страницы
   */
  abstract waitForLoad(): Promise<void>;

  /**
   * Получить заголовок страницы
   */
  async getTitle(): Promise<string> {
    try {
      return await this.page.title();
    } catch {
      return '';
    }
  }

  /**
   * Получить URL страницы
   */
  getURL(): string {
    return this.page.url();
  }

  /**
   * Перезагрузить страницу
   */
  async reload(): Promise<void> {
    logger.step(`Reloading ${this.pageName}`);
    await this.page.reload();
  }

  /**
   * Сделать скриншот страницы
   */
  async screenshot(name?: string): Promise<Buffer> {
    const fileName = name || `${this.pageName}-${Date.now()}`;
    logger.step(`Taking screenshot: ${fileName}`);
    return await this.page.screenshot({ 
      path: `screenshots/${fileName}.png`,
      fullPage: true 
    });
  }

  /**
   * Дождаться загрузки DOM
   */
  async waitForDOMLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Дождаться загрузки сети
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Проверить, что страница загружена
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
