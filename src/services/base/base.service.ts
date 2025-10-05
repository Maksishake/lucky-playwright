/**
 * Base Service
 * Parent class for all Business Logic Services
 */

import { Page, Locator } from '@playwright/test';
import { IService } from '../../types/interfaces/service';
import { logger } from '../../utils/core/logger';
import { GlobalLocators } from '../../config/global.locators';
import { TIMEOUTS } from '../../config/constants';

export abstract class BaseService implements IService {
  constructor(public page: Page) {}

  // ========== LOGGING METHODS ==========

  /**
   * Log step with service name
   */
  protected logStep(message: string, details?: string): void {
    const serviceName = this.constructor.name.replace('Service', '');
    const detailsStr = details ? ` (${details})` : '';
    logger.step(`[${serviceName}] ${message}${detailsStr}`);
  }

  /**
   * Log success with service name
   */
  protected logSuccess(message: string): void {
    const serviceName = this.constructor.name.replace('Service', '');
    logger.success(`[${serviceName}] ${message}`);
  }

  /**
   * Log error with service name
   */
  protected logError(message: string, error?: Error): void {
    const serviceName = this.constructor.name.replace('Service', '');
    logger.error(`[${serviceName}] ${message}`, error);
  }

  /**
   * Log warning with service name
   */
  protected logWarning(message: string): void {
    const serviceName = this.constructor.name.replace('Service', '');
    logger.warning(`[${serviceName}] ${message}`);
  }

  // ========== NETWORK & LOADING ==========
  
  /**
   * Wait for network idle
   */
  protected async waitForNetworkIdle(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
      logger.debug('Network is idle');
    } catch (error) {
      logger.debug('Network idle timeout - continuing');
    }
  }

  // ========== TOAST NOTIFICATIONS ==========

  /**
   * Ждать появления toast уведомления
   * @param type - тип уведомления: 'success' | 'error' | 'any'
   * @param timeout - таймаут ожидания
   * @returns true если toast появился
   */
  protected async waitForToast(
    type: 'success' | 'error' | 'any' = 'any',
    timeout: number = TIMEOUTS.SHORT
  ): Promise<boolean> {
    logger.debug(`Waiting for ${type} toast notification`);

    try {
      let toastSelector: string;

      switch (type) {
        case 'success':
          toastSelector = GlobalLocators.successToast;
          break;
        case 'error':
          toastSelector = GlobalLocators.errorToast;
          break;
        case 'any':
        default:
          toastSelector = GlobalLocators.notification;
          break;
      }

      const toast = this.page.locator(toastSelector).first();
      await toast.waitFor({ state: 'visible', timeout });

      logger.success(`${type} toast notification appeared`);
      return true;
    } catch (error) {
      logger.debug(`No ${type} toast notification found`);
      return false;
    }
  }

  /**
   * Получить текст toast уведомления
   * @param type - тип уведомления
   * @returns текст уведомления или null
   */
  protected async getToastMessage(type: 'success' | 'error' | 'any' = 'any'): Promise<string | null> {
    try {
      let toastSelector: string;

      switch (type) {
        case 'success':
          toastSelector = GlobalLocators.successToast;
          break;
        case 'error':
          toastSelector = GlobalLocators.errorToast;
          break;
        case 'any':
        default:
          toastSelector = GlobalLocators.notification;
          break;
      }

      const toast = this.page.locator(toastSelector).first();
      const isVisible = await toast.isVisible();

      if (isVisible) {
        const text = await toast.textContent();
        logger.debug(`Toast message: ${text}`);
        return text;
      }

      return null;
    } catch (error) {
      logger.debug('Failed to get toast message');
      return null;
    }
  }

  /**
   * Дождаться исчезновения toast уведомления
   * @param timeout - таймаут ожидания
   */
  protected async waitForToastToDisappear(timeout: number = TIMEOUTS.SHORT): Promise<void> {
    try {
      const toast = this.page.locator(GlobalLocators.notification).first();
      await toast.waitFor({ state: 'hidden', timeout });
      logger.debug('Toast notification disappeared');
    } catch (error) {
      logger.debug('Toast already hidden or timeout');
    }
  }

  // ========== SESSION MANAGEMENT ==========

  /**
   * Проверить, жива ли сессия пользователя
   * Проверяет наличие индикаторов авторизованного пользователя
   * @returns true если сессия активна
   */
  protected async checkSessionAlive(): Promise<boolean> {
    logger.debug('Checking if session is alive');

    try {
      // Индикаторы активной сессии
      const sessionIndicators = [
        '[data-testid="user-menu"]',
        '.user-profile',
        '.profile-button',
        'button:has-text("Profile")',
        '[onclick*="modal-user-profile"]',
        '.user-avatar',
        '.username',
        '[data-testid="logout-button"]'
      ];

      // Проверяем каждый индикатор
      for (const selector of sessionIndicators) {
        const element = this.page.locator(selector).first();
        const isVisible = await element.isVisible().catch(() => false);

        if (isVisible) {
          logger.success('Session is alive');
          return true;
        }
      }

      // Дополнительная проверка через cookies/localStorage
      const hasSessionCookie = await this.hasSessionCookie();
      if (hasSessionCookie) {
        logger.success('Session cookie found - session is alive');
        return true;
      }

      logger.warning('Session is not alive - no indicators found');
      return false;
    } catch (error) {
      logger.error('Error checking session', error as Error);
      return false;
    }
  }

  /**
   * Проверить наличие session cookie
   * @returns true если есть cookie авторизации
   */
  private async hasSessionCookie(): Promise<boolean> {
    try {
      const cookies = await this.page.context().cookies();
      
      // Типичные названия session cookies
      const sessionCookieNames = [
        'session',
        'auth_token',
        'access_token',
        'jwt',
        'PHPSESSID',
        'laravel_session',
        'connect.sid'
      ];

      const hasSession = cookies.some(cookie => 
        sessionCookieNames.some(name => 
          cookie.name.toLowerCase().includes(name.toLowerCase())
        )
      );

      return hasSession;
    } catch (error) {
      logger.debug('Failed to check session cookie');
      return false;
    }
  }

  /**
   * Проверить, валидна ли сессия (не истекла)
   * Делает простой запрос к API или проверяет UI
   * @returns true если сессия валидна
   */
  protected async isSessionValid(): Promise<boolean> {
    logger.debug('Validating session');

    // Сначала проверяем базовое наличие сессии
    if (!await this.checkSessionAlive()) {
      return false;
    }

    try {
      // Пробуем обновить страницу и проверить, остались ли индикаторы
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.page.waitForTimeout(1000); // Даем время на загрузку

      const stillAlive = await this.checkSessionAlive();

      if (stillAlive) {
        logger.success('Session is valid');
      } else {
        logger.warning('Session expired after page reload');
      }

      return stillAlive;
    } catch (error) {
      logger.error('Error validating session', error as Error);
      return false;
    }
  }

  /**
   * Получить время жизни сессии из cookies (если доступно)
   * @returns количество секунд до истечения или null
   */
  protected async getSessionExpiryTime(): Promise<number | null> {
    try {
      const cookies = await this.page.context().cookies();
      
      const sessionCookie = cookies.find(cookie => 
        cookie.name.toLowerCase().includes('session') ||
        cookie.name.toLowerCase().includes('token')
      );

      if (sessionCookie && sessionCookie.expires) {
        const now = Date.now() / 1000; // В секундах
        const expiresIn = sessionCookie.expires - now;
        
        logger.debug(`Session expires in ${Math.floor(expiresIn)} seconds`);
        return expiresIn;
      }

      return null;
    } catch (error) {
      logger.debug('Failed to get session expiry time');
      return null;
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Безопасное ожидание элемента
   * @param selector - селектор элемента
   * @param timeout - таймаут
   * @returns Locator или null
   */
  protected async safeWaitForElement(
    selector: string,
    timeout: number = TIMEOUTS.SHORT
  ): Promise<Locator | null> {
    try {
      const element = this.page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout });
      return element;
    } catch (error) {
      logger.debug(`Element ${selector} not found within ${timeout}ms`);
      return null;
    }
  }

  /**
   * Проверить видимость элемента
   * @param selector - селектор элемента
   * @returns true если элемент видим
   */
  protected async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).first().isVisible();
    } catch {
      return false;
    }
  }
}

