/**
 * Waiter Utility
 * Smart waiting helpers for common scenarios
 */

import { Page, Locator } from '@playwright/test';
import { GlobalLocators } from '../../config/global.locators';
import { TIMEOUTS } from '../../config/constants';
import { logger } from './logger';

export class Waiter {
  /**
   * Wait for loader to disappear
   */
  static async waitForLoaderToDisappear(page: Page, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    try {
      logger.debug('Waiting for loader to disappear');
      await page.locator(GlobalLocators.loader).waitFor({ state: 'hidden', timeout });
      logger.debug('Loader disappeared');
    } catch (error) {
      logger.debug('No loader found or already hidden');
    }
  }

  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    logger.debug('Waiting for network idle');
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for element and ensure it's stable
   */
  static async waitForStableElement(locator: Locator, timeout: number = TIMEOUTS.SHORT): Promise<void> {
    logger.debug('Waiting for element to be stable');
    await locator.waitFor({ state: 'visible', timeout });
    
    // Wait for animations to finish
    let previousBox = await locator.boundingBox();
    await new Promise(resolve => setTimeout(resolve, 100));
    let currentBox = await locator.boundingBox();
    
    let attempts = 0;
    while (attempts < 10 && JSON.stringify(previousBox) !== JSON.stringify(currentBox)) {
      previousBox = currentBox;
      await new Promise(resolve => setTimeout(resolve, 100));
      currentBox = await locator.boundingBox();
      attempts++;
    }
    
    logger.debug('Element is stable');
  }

  /**
   * Wait for modal to open
   */
  static async waitForModalOpen(page: Page, timeout: number = TIMEOUTS.SHORT): Promise<void> {
    logger.debug('Waiting for modal to open');
    await page.locator(GlobalLocators.modal).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for modal to close
   */
  static async waitForModalClose(page: Page, timeout: number = TIMEOUTS.SHORT): Promise<void> {
    logger.debug('Waiting for modal to close');
    await page.locator(GlobalLocators.modal).waitFor({ state: 'hidden', timeout });
  }
}

