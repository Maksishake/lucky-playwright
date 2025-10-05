/**
 * Custom Assertions
 * Reusable assertion helpers for common checks
 */

import { expect, Page, Locator } from '@playwright/test';
import { logger } from '../core/logger';

export class Assertions {
  /**
   * Assert element is visible
   */
  static async assertVisible(locator: Locator, name: string, timeout?: number): Promise<void> {
    logger.debug(`Asserting ${name} is visible`);
    await expect(locator).toBeVisible({ timeout });
    logger.success(`${name} is visible`);
  }

  /**
   * Assert element is hidden
   */
  static async assertHidden(locator: Locator, name: string, timeout?: number): Promise<void> {
    logger.debug(`Asserting ${name} is hidden`);
    await expect(locator).toBeHidden({ timeout });
    logger.success(`${name} is hidden`);
  }

  /**
   * Assert text content
   */
  static async assertText(locator: Locator, expectedText: string, name: string): Promise<void> {
    logger.debug(`Asserting ${name} contains text: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
    logger.success(`${name} contains expected text`);
  }

  /**
   * Assert exact text
   */
  static async assertExactText(locator: Locator, expectedText: string, name: string): Promise<void> {
    logger.debug(`Asserting ${name} has exact text: ${expectedText}`);
    await expect(locator).toHaveText(expectedText);
    logger.success(`${name} has exact text`);
  }

  /**
   * Assert element is enabled
   */
  static async assertEnabled(locator: Locator, name: string): Promise<void> {
    logger.debug(`Asserting ${name} is enabled`);
    await expect(locator).toBeEnabled();
    logger.success(`${name} is enabled`);
  }

  /**
   * Assert element is disabled
   */
  static async assertDisabled(locator: Locator, name: string): Promise<void> {
    logger.debug(`Asserting ${name} is disabled`);
    await expect(locator).toBeDisabled();
    logger.success(`${name} is disabled`);
  }

  /**
   * Assert URL contains
   */
  static async assertURLContains(page: Page, urlPart: string): Promise<void> {
    logger.debug(`Asserting URL contains: ${urlPart}`);
    await expect(page).toHaveURL(new RegExp(urlPart));
    logger.success(`URL contains: ${urlPart}`);
  }

  /**
   * Assert count of elements
   */
  static async assertCount(locator: Locator, expectedCount: number, name: string): Promise<void> {
    logger.debug(`Asserting ${name} count is ${expectedCount}`);
    await expect(locator).toHaveCount(expectedCount);
    logger.success(`${name} count is ${expectedCount}`);
  }
}

