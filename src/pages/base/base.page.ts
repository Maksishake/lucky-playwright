/**
 * Base Page Object
 * Parent class for all Page Objects
 */

import { Page } from '@playwright/test';
import { IPageObject } from '@types/interfaces/page-object';
import { logger } from '@utils/logger.util';
import { Waiter } from '@utils/waiter.util';
import { TIMEOUTS } from '@config/constants';

export abstract class BasePage implements IPageObject {
  constructor(public page: Page) {}

  /**
   * Check if page is loaded
   * Override this in child classes
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Wait for page to load
   */
  async waitForLoad(timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    logger.debug(`Waiting for ${this.constructor.name} to load`);
    await this.page.waitForLoadState('networkidle', { timeout });
    await Waiter.waitForLoaderToDisappear(this.page, timeout);
    
    if (!await this.isLoaded()) {
      throw new Error(`${this.constructor.name} failed to load`);
    }
    
    logger.success(`${this.constructor.name} loaded`);
  }

  /**
   * Navigate to a URL
   */
  async navigate(url: string): Promise<void> {
    logger.step(`Navigating to ${url}`);
    await this.page.goto(url);
    await this.waitForLoad();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getURL(): string {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    logger.step('Reloading page');
    await this.page.reload();
    await this.waitForLoad();
  }

  /**
   * Take screenshot
   */
  async screenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.constructor.name}-${Date.now()}`;
    logger.debug(`Taking screenshot: ${screenshotName}`);
    return await this.page.screenshot({ path: `screenshots/${screenshotName}.png`, fullPage: true });
  }
}

