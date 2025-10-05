/**
 * Navigation Service
 * Service for page navigation using BasePage navigate method
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { BasePage } from '@pages/base/base.page';

export class NavigationService extends BaseService {
  private basePage: BasePage;

  constructor(page: Page) {
    super(page);
    this.basePage = new (class extends BasePage {
      async isLoaded(): Promise<boolean> {
        try {
          const body = this.page.locator('body');
          const isVisible = await body.isVisible({ timeout: 1000 });
          return isVisible;
        } catch {
          return false;
        }
      }
    })(page);
  }

  /**
   * Navigate to any URL using BasePage navigate method
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    this.logStep(`Navigating to ${url}`);
    await this.basePage.navigate(url);
    this.logSuccess(`Successfully navigated to ${url}`);
  }

  /**
   * Navigate to home page
   */
  async goHome(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Navigate to slots page
   */
  async goToSlots(): Promise<void> {
    await this.navigateTo('/slots');
  }

  /**
   * Navigate to live casino page
   */
  async goToLiveCasino(): Promise<void> {
    await this.navigateTo('/live-casino');
  }

  /**
   * Navigate to bonuses page
   */
  async goToBonuses(): Promise<void> {
    await this.navigateTo('/bonuses');
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.basePage.getTitle();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.basePage.getURL();
  }
}
