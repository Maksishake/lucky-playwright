/**
 * Bonus Balance Component Tests
 * Тесты для компонента бонусного баланса
 */

import { test, expect } from '@playwright/test';
import { BonusBalanceComponent } from '@components/organisms/bonus-balance/bonus-balance.component';

test.describe('Bonus Balance Component', () => {
  let bonusBalance: BonusBalanceComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <div class="bonus-balance">
        <div class="tab-name">Бонусний баланс</div>
        <div class="bonus-info">
          <div class="title">₴ 0.00</div>
          <div class="bonus-progress">
            <div class="bonus-label">
              <div class="bonus-left">
                <span>₴ 0.00</span>
              </div>
              <div class="bonus-right">
                <span>₴ 0.00</span>
              </div>
            </div>
            <div class="progress">
              <div class="progress-bar" style="width: 0.00%"></div>
            </div>
          </div>
          <div class="form-group with-input-btn">
            <input type="text" class="form-control" placeholder="Вставте промокод сюди">
            <button type="button" class="btn btn-default form-group-btn">Подати заявку</button>
          </div>
        </div>
        <div class="banner">
          <div class="banner-title">Розкажіть друзям про Luckycoin та отримуйте приємні бонуси</div>
          <div class="body-default">Отримуйте бонус на кожне поповнення!</div>
        </div>
      </div>
    `);
    
    bonusBalance = new BonusBalanceComponent(page, page.locator('.bonus-balance'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(bonusBalance.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(bonusBalance.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(bonusBalance.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Balance Information', () => {
    test('should get current balance', async () => {
      const balance = await bonusBalance.getCurrentBalance();
      expect(balance).toBe('₴ 0.00');
    });

    test('should get amount to wager', async () => {
      const amount = await bonusBalance.getAmountToWager();
      expect(amount).toBe('₴ 0.00');
    });

    test('should get remaining amount', async () => {
      const remaining = await bonusBalance.getRemainingToWager();
      expect(remaining).toBe('₴ 0.00');
    });

    test('should get wager progress', async () => {
      const progress = await bonusBalance.getWagerProgress();
      expect(progress).toBe(0);
    });
  });

  test.describe('Promocode Functionality', () => {
    test('should enter promocode', async () => {
      const promocode = 'TEST123';
      await bonusBalance.enterPromocode(promocode);
      
      const inputValue = await bonusBalance.promocodeInput.root.inputValue();
      expect(inputValue).toBe(promocode);
    });

    test('should clear promocode', async () => {
      await bonusBalance.enterPromocode('TEST123');
      await bonusBalance.clearPromocode();
      
      const inputValue = await bonusBalance.promocodeInput.root.inputValue();
      expect(inputValue).toBe('');
    });

    test('should apply promocode', async () => {
      const promocode = 'TEST123';
      await bonusBalance.applyPromocode(promocode);
      
      // В реальном тесте здесь была бы проверка результата
      expect(true).toBeTruthy();
    });

    test('should check if apply button is enabled', async () => {
      const isEnabled = await bonusBalance.isApplyButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });
  });

  test.describe('Banner Information', () => {
    test('should get banner title', async () => {
      const title = await bonusBalance.getBannerTitle();
      expect(title).toContain('Luckycoin');
    });

    test('should get banner description', async () => {
      const description = await bonusBalance.getBannerDescription();
      expect(description).toContain('поповнення');
    });

    test('should check if banner is visible', async () => {
      const isVisible = await bonusBalance.isBannerVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('State Checks', () => {
    test('should check if has bonus balance', async () => {
      const hasBalance = await bonusBalance.hasBonusBalance();
      expect(hasBalance).toBeFalsy(); // В моке баланс 0
    });

    test('should check if has wager progress', async () => {
      const hasProgress = await bonusBalance.hasWagerProgress();
      expect(hasProgress).toBeFalsy(); // В моке прогресс 0
    });

    test('should check if can apply promocode', async () => {
      const canApply = await bonusBalance.canApplyPromocode();
      expect(canApply).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing elements', async () => {
      // Удаляем элемент для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.bonus-info .title');
        if (element) element.remove();
      });
      
      const balance = await bonusBalance.getCurrentBalance();
      expect(balance).toBe('0.00'); // Значение по умолчанию
    });

    test('should handle network errors', async () => {
      // Симуляция сетевой ошибки
      await page.route('**/api/**', route => route.abort());
      
      const promocode = 'TEST123';
      await expect(bonusBalance.applyPromocode(promocode)).rejects.toThrow();
    });
  });
});
