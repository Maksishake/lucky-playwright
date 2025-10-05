import { Locator, Page } from '@playwright/test';
import { BaseModal } from '@core/abstract/base.modal';

export class PromocodeModalComponent extends BaseModal {
  readonly modalRoot: Locator;
  readonly modalDialog: Locator;
  readonly modalContent: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly promoLabel: Locator;
  readonly promoInput: Locator;
  readonly applyButton: Locator;
  readonly applyButtonLoading: Locator;

  constructor(page: Page, root: Locator) {
    super(page, root, 'Promocode Modal');
    this.modalRoot = root;
    this.modalDialog = this.modalRoot.locator('.modal-dialog');
    this.modalContent = this.modalRoot.locator('.modal-content');
    this.title = this.modalRoot.locator('.modal-title');
    this.closeButton = this.modalRoot.locator('.modal-close-alpine');
    this.promoLabel = this.modalRoot.locator('label[for="inputPromoCode"]');
    this.promoInput = this.modalRoot.locator('#inputPromoCode');
    this.applyButton = this.modalRoot.locator('button[wire\\:click="applyCode"] >> span:has-text("Застосувати")');
    this.applyButtonLoading = this.modalRoot.locator('button[wire\\:click="applyCode"] >> span:has-text("Applying...")');
  }

  async isLoaded(): Promise<boolean> {
    return await this.modalRoot.isVisible();
  }

  async waitForLoad(): Promise<void> {
    await this.modalRoot.waitFor({ state: 'visible' });
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.promoInput.fill(code);
    await this.applyButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}