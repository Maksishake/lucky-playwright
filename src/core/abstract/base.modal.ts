/**
 * Base Modal Abstract Class
 * Базовый абстрактный класс для всех модальных окон
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export abstract class BaseModal extends BaseComponent {
  protected modalContent: Locator;
  protected modalHeader: Locator;
  protected modalBody: Locator;
  protected closeButton: Locator;
  protected overlay: Locator;

  constructor(page: Page, root: Locator, componentName: string) {
    super(page, root, componentName);
    
    this.modalContent = root.locator('.modal-content, .modal-dialog, .modal');
    this.modalHeader = this.modalContent.locator('.modal-header, .modal-title');
    this.modalBody = this.modalContent.locator('.modal-body, .modal-content');
    this.closeButton = this.modalContent.locator('.close, .modal-close, [data-dismiss="modal"], [aria-label="Close"]');
    this.overlay = page.locator('.modal-backdrop, .modal-overlay');
  }

  /**
   * Проверить видимость модального окна
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку модального окна
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.modalContent.isVisible() && await this.modalBody.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки модального окна
   */
  async waitForLoad(): Promise<void> {
    await this.modalContent.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.modalBody.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success(`Модальное окно ${this.componentName} загружено`);
  }

  /**
   * Закрыть модальное окно
   */
  async close(): Promise<void> {
    logger.step(`Закрытие модального окна ${this.componentName}`);
    
    try {
      if (await this.closeButton.isVisible({ timeout: 1000 })) {
        await this.closeButton.click();
        await this.waitForClose();
        logger.success(`Модальное окно ${this.componentName} закрыто через кнопку`);
        return;
      }
    } catch (error) {
      logger.debug('Кнопка закрытия не найдена, пробуем альтернативные способы');
    }

    try {
      if (await this.overlay.isVisible({ timeout: 1000 })) {
        await this.overlay.click();
        await this.waitForClose();
        logger.success(`Модальное окно ${this.componentName} закрыто через overlay`);
        return;
      }
    } catch (error) {
      logger.debug('Overlay не найден, пробуем ESC');
    }

    try {
      await this.page.keyboard.press('Escape');
      await this.waitForClose();
      logger.success(`Модальное окно ${this.componentName} закрыто через ESC`);
    } catch (error) {
      logger.warning('Все способы закрытия модального окна не сработали');
    }
  }

  /**
   * Дождаться открытия модального окна
   */
  async waitForOpen(): Promise<void> {
    logger.step(`Ожидание открытия модального окна ${this.componentName}`);
    await this.modalContent.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    logger.success(`Модальное окно ${this.componentName} открыто`);
  }

  /**
   * Дождаться закрытия модального окна
   */
  async waitForClose(): Promise<void> {
    logger.step(`Ожидание закрытия модального окна ${this.componentName}`);
    await this.modalContent.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM });
    logger.success(`Модальное окно ${this.componentName} закрыто`);
  }

  /**
   * Получить заголовок модального окна
   */
  async getTitle(): Promise<string> {
    try {
      return await this.modalHeader.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить содержимое модального окна
   */
  async getContent(): Promise<string> {
    try {
      return await this.modalBody.textContent() || '';
    } catch {
      return '';
    }
  }
}
