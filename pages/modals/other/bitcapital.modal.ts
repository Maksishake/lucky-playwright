import { Locator, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Page Object для модального окна Bitcapital
 */
export class BitcapitalModal extends BaseModal {

  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    modal: () => this.page.locator('#modal-bitcapital-offer'),
    closeButton: () => this.page.locator('#modal-bitcapital-offer .modal-close'),
    loanButton: () => this.page.locator('#modal-bitcapital-offer a:has-text("Оформити займ")'),
    offerButton: () => this.page.locator('#modal-bitcapital-offer a:has-text("Пропозицію")'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========
  async isLoaded(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.locators.modal()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ МОДАЛЬНОГО ОКНА ==========

  async isOpen(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async open(): Promise<void> {
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    await this.locators.closeButton().click();
    await expect(this.locators.modal()).toBeHidden({ timeout: 5000 });
  }

  // ========== БАЗОВЫЕ ДЕЙСТВИЯ ==========

  async clickCloseButton(): Promise<void> {
    await this.locators.closeButton().click();
  }

  async clickLoanButton(): Promise<void> {
    await this.locators.loanButton().click();
  }

  async clickOfferButton(): Promise<void> {
    await this.locators.offerButton().click();
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========
  async expectVisibleCloseButton(): Promise<void> {
    await expect(this.locators.closeButton()).toBeVisible();
  }

  async expectVisibleLoanButton(): Promise<void> {
    await expect(this.locators.loanButton()).toBeVisible();
  }

  async expectVisibleOfferButton(): Promise<void> {
    await expect(this.locators.offerButton()).toBeVisible();
  }
}

