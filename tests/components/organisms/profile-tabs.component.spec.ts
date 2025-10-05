/**
 * Profile Tabs Component Tests
 * Тесты для компонента табов профиля
 */

import { test, expect } from '@playwright/test';
import { ProfileTabsComponent } from '@components/organisms/profile-tabs/profile-tabs.component';

test.describe('ProfileTabsComponent', () => {
  let profileTabs: ProfileTabsComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <div class="tabs pl-lg w-full">
        <ul class="tab-nav">
          <li class="tab-item" wire:click="setTab('overview')">
            <span>Огляд</span>
          </li>
          <li class="tab-item active" wire:click="setTab('details')">
            <span>Деталі користувача</span>
          </li>
          <li class="tab-item" wire:click="setTab('security')">
            <span>Безпека</span>
          </li>
          <li class="tab-item" wire:click="setTab('verification')">
            <span>Верифікація</span>
          </li>
        </ul>
      </div>
    `);
    
    profileTabs = new ProfileTabsComponent(page, page.locator('.tabs'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(profileTabs.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(profileTabs.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(profileTabs.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Tab Selection', () => {
    test('should select tab by name', async () => {
      await profileTabs.selectTab('Огляд');
      await expect(profileTabs.isTabActive('Огляд')).resolves.toBeTruthy();
    });

    test('should select overview tab', async () => {
      await profileTabs.selectOverviewTab();
      await expect(profileTabs.isOverviewTabActive()).resolves.toBeTruthy();
    });

    test('should select details tab', async () => {
      await profileTabs.selectDetailsTab();
      await expect(profileTabs.isDetailsTabActive()).resolves.toBeTruthy();
    });

    test('should select security tab', async () => {
      await profileTabs.selectSecurityTab();
      await expect(profileTabs.isSecurityTabActive()).resolves.toBeTruthy();
    });

    test('should select verification tab', async () => {
      await profileTabs.selectVerificationTab();
      await expect(profileTabs.isVerificationTabActive()).resolves.toBeTruthy();
    });
  });

  test.describe('Tab Information', () => {
    test('should get all tab names', async () => {
      const tabNames = await profileTabs.getAllTabNames();
      expect(tabNames).toEqual(['Огляд', 'Деталі користувача', 'Безпека', 'Верифікація']);
    });

    test('should get active tab name', async () => {
      const activeTab = await profileTabs.getActiveTabName();
      expect(activeTab).toBe('Деталі користувача'); // В моке этот таб активен
    });

    test('should get tabs count', async () => {
      const count = await profileTabs.getTabsCount();
      expect(count).toBe(4);
    });
  });

  test.describe('Tab State Checks', () => {
    test('should check if tab is active', async () => {
      const isActive = await profileTabs.isTabActive('Деталі користувача');
      expect(isActive).toBeTruthy(); // В моке этот таб активен
    });

    test('should check if overview tab is active', async () => {
      const isActive = await profileTabs.isOverviewTabActive();
      expect(isActive).toBeFalsy(); // В моке этот таб не активен
    });

    test('should check if details tab is active', async () => {
      const isActive = await profileTabs.isDetailsTabActive();
      expect(isActive).toBeTruthy(); // В моке этот таб активен
    });

    test('should check if security tab is active', async () => {
      const isActive = await profileTabs.isSecurityTabActive();
      expect(isActive).toBeFalsy(); // В моке этот таб не активен
    });

    test('should check if verification tab is active', async () => {
      const isActive = await profileTabs.isVerificationTabActive();
      expect(isActive).toBeFalsy(); // В моке этот таб не активен
    });
  });

  test.describe('Component State', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await profileTabs.isTabsFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should have all tabs visible', async () => {
      const areVisible = await profileTabs.areAllTabsVisible();
      expect(areVisible).toBeTruthy();
    });

    test('should check if tab is clickable', async () => {
      const isClickable = await profileTabs.isTabClickable('Огляд');
      expect(isClickable).toBeTruthy();
    });
  });

  test.describe('Text Search', () => {
    test('should check if tab contains text', async () => {
      const containsText = await profileTabs.tabContainsText('Огляд', 'Огляд');
      expect(containsText).toBeTruthy();
    });

    test('should find tab by text', async () => {
      const tabName = await profileTabs.findTabByText('Безпека');
      expect(tabName).toBe('Безпека');
    });

    test('should not find non-existent tab', async () => {
      const tabName = await profileTabs.findTabByText('Несуществующий таб');
      expect(tabName).toBeNull();
    });
  });

  test.describe('Navigation', () => {
    test('should select next tab', async () => {
      await profileTabs.selectNextTab();
      // В реальном тесте здесь нужно проверить, что переключился на следующий таб
    });

    test('should select previous tab', async () => {
      await profileTabs.selectPreviousTab();
      // В реальном тесте здесь нужно проверить, что переключился на предыдущий таб
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing tab nav', async () => {
      // Удаляем навигацию табов для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.tab-nav');
        if (element) element.remove();
      });
      
      const tabNames = await profileTabs.getAllTabNames();
      expect(tabNames.length).toBe(0);
    });

    test('should handle missing tab items', async () => {
      // Удаляем элементы табов для тестирования обработки ошибок
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.tab-item');
        elements.forEach(el => el.remove());
      });
      
      const count = await profileTabs.getTabsCount();
      expect(count).toBe(0);
    });

    test('should handle non-existent tab selection', async () => {
      await expect(profileTabs.selectTab('Несуществующий таб')).rejects.toThrow();
    });
  });

  test.describe('Multiple Tabs', () => {
    test.beforeEach(async () => {
      // Создаем несколько наборов табов для тестирования
      await page.setContent(`
        <div class="tabs-container">
          <div class="tabs1">
            <ul class="tab-nav">
              <li class="tab-item active">Таб 1</li>
              <li class="tab-item">Таб 2</li>
            </ul>
          </div>
          <div class="tabs2">
            <ul class="tab-nav">
              <li class="tab-item">Таб 3</li>
              <li class="tab-item active">Таб 4</li>
            </ul>
          </div>
        </div>
      `);
    });

    test('should work with multiple tab sets', async () => {
      const tabs1 = new ProfileTabsComponent(page, page.locator('.tabs1'));
      const tabs2 = new ProfileTabsComponent(page, page.locator('.tabs2'));
      
      const activeTab1 = await tabs1.getActiveTabName();
      const activeTab2 = await tabs2.getActiveTabName();
      
      expect(activeTab1).toBe('Таб 1');
      expect(activeTab2).toBe('Таб 4');
    });
  });
});
