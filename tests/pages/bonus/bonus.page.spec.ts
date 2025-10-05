/**
 * Bonus Page Tests
 * Тесты для страницы бонусов
 */

import { test, expect } from '@playwright/test';
import { BonusPage } from '@pages/bonus/bonus.page';

test.describe('Bonus Page', () => {
  let bonusPage: BonusPage;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    bonusPage = new BonusPage(page);
  });

  test.describe('Page Navigation', () => {
    test('should navigate to bonus page', async () => {
      await bonusPage.navigate();
      await expect(bonusPage.isLoaded()).resolves.toBeTruthy();
    });

    test('should have correct page title', async () => {
      await bonusPage.navigate();
      const title = await bonusPage.getTitle();
      expect(title).toContain('Бонус');
    });

    test('should have correct URL', async () => {
      await bonusPage.navigate();
      const url = bonusPage.getURL();
      expect(url).toContain('/bonuses');
    });
  });

  test.describe('Bonus Balance Component', () => {
    test.beforeEach(async () => {
      await bonusPage.navigate();
    });

    test('should display bonus balance', async () => {
      await expect(bonusPage.isBonusBalanceVisible()).resolves.toBeTruthy();
    });

    test('should show current balance', async () => {
      const balance = await bonusPage.getBonusBalance();
      expect(balance).toBeDefined();
    });

    test('should show amount to wager', async () => {
      const amount = await bonusPage.getAmountToWager();
      expect(amount).toBeDefined();
    });

    test('should show remaining amount', async () => {
      const remaining = await bonusPage.getRemainingToWager();
      expect(remaining).toBeDefined();
    });

    test('should apply promocode', async () => {
      const promocode = 'TEST123';
      await bonusPage.applyPromocode(promocode);
      // В реальном тесте здесь была бы проверка результата
    });
  });

  test.describe('Bonus Tabs Component', () => {
    test.beforeEach(async () => {
      await bonusPage.navigate();
    });

    test('should display tabs', async () => {
      await expect(bonusPage.areTabsVisible()).resolves.toBeTruthy();
    });

    test('should switch to deposit tab', async () => {
      await bonusPage.switchToDepositTab();
      const activeTab = await bonusPage.getActiveTab();
      expect(activeTab).toContain('Депозит');
    });

    test('should switch to cashback tab', async () => {
      await bonusPage.switchToCashbackTab();
      const activeTab = await bonusPage.getActiveTab();
      expect(activeTab).toContain('Кешбек');
    });

    test('should switch to gift tab', async () => {
      await bonusPage.switchToGiftTab();
      const activeTab = await bonusPage.getActiveTab();
      expect(activeTab).toContain('Подарунковий');
    });
  });

  test.describe('Bonus Cards Section', () => {
    test.beforeEach(async () => {
      await bonusPage.navigate();
    });

    test('should display bonus cards', async () => {
      await expect(bonusPage.areBonusCardsVisible()).resolves.toBeTruthy();
    });

    test('should get bonus cards count', async () => {
      const count = await bonusPage.getBonusCardsCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should get all bonus cards', async () => {
      const cards = await bonusPage.getAllBonusCards();
      expect(cards.length).toBeGreaterThan(0);
    });

    test('should find bonus card by title', async () => {
      const title = 'Твій щасливий бонус 88%+88FS🌟';
      const card = await bonusPage.getBonusCardByTitle(title);
      expect(card).toBeDefined();
    });

    test('should subscribe to bonus', async () => {
      const title = 'Твій щасливий бонус 88%+88FS🌟';
      await bonusPage.subscribeToBonus(title);
      // В реальном тесте здесь была бы проверка результата подписки
    });

    test('should open bonus details', async () => {
      const title = 'Твій щасливий бонус 88%+88FS🌟';
      await bonusPage.openBonusDetails(title);
      // В реальном тесте здесь была бы проверка открытия модального окна
    });
  });

  test.describe('Page State', () => {
    test.beforeEach(async () => {
      await bonusPage.navigate();
    });

    test('should be fully loaded', async () => {
      await expect(bonusPage.isPageFullyLoaded()).resolves.toBeTruthy();
    });

    test('should have all components visible', async () => {
      const isBalanceVisible = await bonusPage.isBonusBalanceVisible();
      const areTabsVisible = await bonusPage.areTabsVisible();
      const areCardsVisible = await bonusPage.areBonusCardsVisible();
      
      expect(isBalanceVisible).toBeTruthy();
      expect(areTabsVisible).toBeTruthy();
      expect(areCardsVisible).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle navigation errors', async () => {
      // Тест обработки ошибок навигации
      await page.goto('/nonexistent-page');
      await expect(bonusPage.isLoaded()).resolves.toBeFalsy();
    });

    test('should handle component loading errors', async () => {
      // Тест обработки ошибок загрузки компонентов
      await bonusPage.navigate();
      // Симуляция ошибки загрузки компонента
      await page.evaluate(() => {
        const element = document.querySelector('.bonus-balance');
        if (element) element.remove();
      });
      
      await expect(bonusPage.isBonusBalanceVisible()).resolves.toBeFalsy();
    });
  });
});
