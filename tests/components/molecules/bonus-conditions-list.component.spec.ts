/**
 * Bonus Conditions List Component Tests
 * Тесты для компонента списка условий бонуса
 */

import { test, expect } from '@playwright/test';
import { BonusConditionsListComponent } from '@components/molecules/bonus-conditions-list/bonus-conditions-list.component';

test.describe('Bonus Conditions List Component', () => {
  let conditionsList: BonusConditionsListComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <ul class="flex-col gap-lg body-semibold">
        <li>
          <div class="list-wrapper">
            <div class="list-item"></div>
            <div class="list-item-text">Мінімальна сума депозиту: 500 UAH</div>
          </div>
        </li>
        <li>
          <div class="list-wrapper">
            <div class="list-item"></div>
            <div class="list-item-text">Макс. Бонус: 3500 UAH</div>
          </div>
        </li>
        <li>
          <div class="list-wrapper">
            <div class="list-item"></div>
            <div class="list-item-text">Wager: UAH: x35</div>
          </div>
        </li>
        <li>
          <div class="list-wrapper">
            <div class="list-item"></div>
            <div class="list-item-text">Валюта: UAH</div>
          </div>
        </li>
        <li>
          <div class="list-wrapper">
            <div class="list-item"></div>
            <div class="list-item-text">Only slots</div>
          </div>
        </li>
      </ul>
    `);
    
    conditionsList = new BonusConditionsListComponent(page, page.locator('ul'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(conditionsList.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(conditionsList.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(conditionsList.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Conditions Retrieval', () => {
    test('should get all conditions', async () => {
      const conditions = await conditionsList.getAllConditions();
      expect(conditions.length).toBe(5);
      expect(conditions).toContain('Мінімальна сума депозиту: 500 UAH');
    });

    test('should get condition by index', async () => {
      const condition = await conditionsList.getConditionByIndex(0);
      expect(condition).toContain('Мінімальна сума депозиту');
    });

    test('should get conditions count', async () => {
      const count = await conditionsList.getConditionsCount();
      expect(count).toBe(5);
    });

    test('should find condition by text', async () => {
      const condition = await conditionsList.findConditionByText('депозиту');
      expect(condition).toContain('Мінімальна сума депозиту');
    });

    test('should find condition index by text', async () => {
      const index = await conditionsList.findConditionIndexByText('депозиту');
      expect(index).toBe(0);
    });
  });

  test.describe('Specific Conditions', () => {
    test('should get min deposit amount', async () => {
      const amount = await conditionsList.getMinDepositAmount();
      expect(amount).toBe('500 UAH');
    });

    test('should get max bonus amount', async () => {
      const amount = await conditionsList.getMaxBonusAmount();
      expect(amount).toBe('3500 UAH');
    });

    test('should get wager', async () => {
      const wager = await conditionsList.getWager();
      expect(wager).toBe('UAH: x35');
    });

    test('should get currency', async () => {
      const currency = await conditionsList.getCurrency();
      expect(currency).toBe('UAH');
    });

    test('should get game type', async () => {
      const gameType = await conditionsList.getGameType();
      expect(gameType).toBe('Only slots');
    });
  });

  test.describe('State Checks', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await conditionsList.isListFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should have all items visible', async () => {
      const areVisible = await conditionsList.areAllItemsVisible();
      expect(areVisible).toBeTruthy();
    });

    test('should have expected count', async () => {
      const hasExpectedCount = await conditionsList.hasExpectedCount(5);
      expect(hasExpectedCount).toBeTruthy();
    });
  });

  test.describe('Text Search', () => {
    test('should contain text', async () => {
      const containsText = await conditionsList.containsText('депозиту');
      expect(containsText).toBeTruthy();
    });

    test('should contain all texts', async () => {
      const containsAll = await conditionsList.containsAllTexts(['депозиту', 'Бонус', 'Wager']);
      expect(containsAll).toBeTruthy();
    });

    test('should contain any text', async () => {
      const containsAny = await conditionsList.containsAnyText(['депозиту', 'несуществующий']);
      expect(containsAny).toBeTruthy();
    });

    test('should not contain non-existent text', async () => {
      const containsText = await conditionsList.containsText('несуществующий текст');
      expect(containsText).toBeFalsy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing items', async () => {
      // Удаляем элементы для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('ul');
        if (element) element.innerHTML = '';
      });
      
      const conditions = await conditionsList.getAllConditions();
      expect(conditions.length).toBe(0);
    });

    test('should handle missing text elements', async () => {
      // Удаляем текст элементов для тестирования обработки ошибок
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.list-item-text');
        elements.forEach(el => el.remove());
      });
      
      const conditions = await conditionsList.getAllConditions();
      expect(conditions.length).toBe(0);
    });

    test('should handle invalid index', async () => {
      const condition = await conditionsList.getConditionByIndex(999);
      expect(condition).toBe('');
    });

    test('should handle non-existent text search', async () => {
      const condition = await conditionsList.findConditionByText('несуществующий текст');
      expect(condition).toBeNull();
    });
  });

  test.describe('Multiple Lists', () => {
    test.beforeEach(async () => {
      // Создаем несколько списков для тестирования
      await page.setContent(`
        <div class="lists">
          <ul class="list1">
            <li><div class="list-item-text">Условие 1</div></li>
            <li><div class="list-item-text">Условие 2</div></li>
          </ul>
          <ul class="list2">
            <li><div class="list-item-text">Условие 3</div></li>
            <li><div class="list-item-text">Условие 4</div></li>
          </ul>
        </div>
      `);
    });

    test('should work with multiple lists', async () => {
      const list1 = new BonusConditionsListComponent(page, page.locator('.list1'));
      const list2 = new BonusConditionsListComponent(page, page.locator('.list2'));
      
      const conditions1 = await list1.getAllConditions();
      const conditions2 = await list2.getAllConditions();
      
      expect(conditions1.length).toBe(2);
      expect(conditions2.length).toBe(2);
      expect(conditions1).toContain('Условие 1');
      expect(conditions2).toContain('Условие 3');
    });
  });
});
