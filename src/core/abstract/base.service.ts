/**
 * Base Service - Abstract Class
 * Абстрактный базовый класс для всех сервисов
 */

import { Page } from '@playwright/test';
import { logger } from '@utils/logger.util';

export abstract class BaseService {
  protected page: Page;
  protected serviceName: string;

  constructor(page: Page, serviceName: string) {
    this.page = page;
    this.serviceName = serviceName;
  }

  /**
   * Логировать шаг
   */
  logStep(message: string, details?: string): void {
    logger.step(`[${this.serviceName}] ${message}`, details);
  }

  /**
   * Логировать успех
   */
  logSuccess(message: string): void {
    logger.success(`[${this.serviceName}] ${message}`);
  }

  /**
   * Логировать ошибку
   */
  logError(message: string, error?: Error): void {
    logger.error(`[${this.serviceName}] ${message}`, error);
  }

  /**
   * Логировать предупреждение
   */
  logWarning(message: string): void {
    logger.warning(`[${this.serviceName}] ${message}`);
  }

  /**
   * Дождаться завершения сетевых запросов
   */
  async waitForNetworkIdle(timeout?: number): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      this.logWarning('Network idle timeout - continuing');
    }
  }

  /**
   * Дождаться появления toast уведомления
   */
  async waitForToast(type?: 'success' | 'error' | 'any', timeout: number = 5000): Promise<boolean> {
    try {
      const selector = type === 'success' ? '.toast-success' : 
                     type === 'error' ? '.toast-error' : '.toast';
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Получить сообщение toast
   */
  async getToastMessage(type?: 'success' | 'error' | 'any'): Promise<string | null> {
    try {
      const selector = type === 'success' ? '.toast-success' : 
                     type === 'error' ? '.toast-error' : '.toast';
      const element = this.page.locator(selector);
      return await element.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Дождаться исчезновения toast
   */
  async waitForToastToDisappear(timeout: number = 5000): Promise<void> {
    try {
      await this.page.waitForSelector('.toast', { state: 'hidden', timeout });
    } catch (error) {
      this.logWarning('Toast disappearance timeout - continuing');
    }
  }

  /**
   * Проверить активность сессии
   */
  async checkSessionAlive(): Promise<boolean> {
    try {
      const response = await this.page.request.get('/api/session/check');
      return response.ok();
    } catch {
      return false;
    }
  }

  /**
   * Проверить видимость элемента
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться появления элемента
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { timeout });
    } catch (error) {
      this.logError(`Element ${selector} not found within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Выполнить JavaScript в контексте страницы
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    try {
      return await this.page.evaluate(script, ...args);
    } catch (error) {
      this.logError('Script execution failed', error as Error);
      throw error;
    }
  }
}
