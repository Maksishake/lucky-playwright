import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

/**
 * Bitcapital Modal Component
 * UI-слой для модального окна Bitcapital
 */
export class BitcapitalModalComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root, 'Bitcapital Modal');
  }

  // ========== ЛОКАТОРЫ ==========

  get modal(): Locator {
    return this.page.locator('#modal-bitcapital-offer');
  }

  get closeButton(): Locator {
    return this.page.locator('#modal-bitcapital-offer .modal-close, #modal-bitcapital-offer .close-button, #modal-bitcapital-offer [data-dismiss="modal"], #modal-bitcapital-offer .close, #modal-bitcapital-offer [aria-label="Close"]');
  }

  get title(): Locator {
    return this.page.locator('#modal-bitcapital-offer .modal-title, #modal-bitcapital-offer h3, #modal-bitcapital-offer .title');
  }

  get content(): Locator {
    return this.page.locator('#modal-bitcapital-offer .modal-body, #modal-bitcapital-offer .modal-content, #modal-bitcapital-offer .content');
  }

  get acceptButton(): Locator {
    return this.page.locator('#modal-bitcapital-offer button:has-text("Accept"), #modal-bitcapital-offer button:has-text("Принять"), #modal-bitcapital-offer .btn-accept, #modal-bitcapital-offer .accept-button');
  }

  get declineButton(): Locator {
    return this.page.locator('#modal-bitcapital-offer button:has-text("Decline"), #modal-bitcapital-offer button:has-text("Отклонить"), #modal-bitcapital-offer .btn-decline, #modal-bitcapital-offer .decline-button');
  }

  get overlay(): Locator {
    return this.page.locator('#modal-bitcapital-offer .modal-backdrop, #modal-bitcapital-offer .overlay, #modal-bitcapital-offer .backdrop');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость компонента
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку компонента
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.modal.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.modal.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  // ========== БАЗОВЫЕ UI ДЕЙСТВИЯ ==========

  /**
   * Закрыть модальное окно
   */
  async close(): Promise<void> {
    logger.step('Closing Bitcapital modal');
    
    try {
      // Пробуем найти и кликнуть кнопку закрытия
      const closeBtn = this.closeButton;
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
        logger.success('Bitcapital modal closed via close button');
        return;
      }
    } catch (error) {
      logger.debug('Close button not found, trying alternative methods');
    }

    try {
      // Альтернативный способ закрытия - клик по overlay
      const overlay = this.overlay;
      if (await overlay.isVisible({ timeout: 1000 })) {
        await overlay.click();
        await this.page.waitForLoadState('domcontentloaded');
        logger.success('Bitcapital modal closed via overlay click');
        return;
      }
    } catch (error) {
      logger.debug('Overlay click failed, trying ESC key');
    }

    try {
      // Последний способ - нажатие ESC
      await this.page.keyboard.press('Escape');
      await this.page.waitForLoadState('domcontentloaded');
      logger.success('Bitcapital modal closed via ESC key');
    } catch (error) {
      logger.warning('All close methods failed');
    }
  }

  /**
   * Принять предложение
   */
  async accept(): Promise<void> {
    logger.step('Accepting Bitcapital offer');
    await this.acceptButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Bitcapital offer accepted');
  }

  /**
   * Отклонить предложение
   */
  async decline(): Promise<void> {
    logger.step('Declining Bitcapital offer');
    await this.declineButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    logger.success('Bitcapital offer declined');
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить заголовок модального окна
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.title.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить содержимое модального окна
   */
  async getContent(): Promise<string | null> {
    try {
      return await this.content.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить полную информацию о модальном окне
   */
  async getModalInfo(): Promise<{
    title: string | null;
    content: string | null;
    hasAcceptButton: boolean;
    hasDeclineButton: boolean;
  }> {
    const [title, content, hasAcceptButton, hasDeclineButton] = await Promise.all([
      this.getTitle(),
      this.getContent(),
      this.hasAcceptButton(),
      this.hasDeclineButton()
    ]);

    return { title, content, hasAcceptButton, hasDeclineButton };
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, видимо ли модальное окно
   */
  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка принятия
   */
  async hasAcceptButton(): Promise<boolean> {
    return await this.acceptButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли кнопка отклонения
   */
  async hasDeclineButton(): Promise<boolean> {
    return await this.declineButton.isVisible().catch(() => false);
  }

  /**
   * Проверить, есть ли overlay
   */
  async hasOverlay(): Promise<boolean> {
    return await this.overlay.isVisible().catch(() => false);
  }

  /**
   * Дождаться открытия модального окна
   */
  async waitForOpen(): Promise<void> {
    logger.step('Waiting for Bitcapital modal to open');
    await this.modal.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    logger.success('Bitcapital modal opened');
  }

  /**
   * Дождаться закрытия модального окна
   */
  async waitForClose(): Promise<void> {
    logger.step('Waiting for Bitcapital modal to close');
    await this.modal.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM });
    logger.success('Bitcapital modal closed');
  }
}
