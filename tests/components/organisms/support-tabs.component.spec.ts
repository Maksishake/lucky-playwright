/**
 * Support Tabs Component Tests
 * Тесты для компонента табов поддержки
 */

import { test, expect } from '@playwright/test';
import { SupportTabsComponent } from '@components/organisms/support-tabs';

test.describe('SupportTabsComponent', () => {
  let supportTabs: SupportTabsComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div class="tabs tabs-menu w-full">
        <ul class="tab-nav">
          <li class="tab-item active" wire:click="setActiveTab(&quot;terms-n-conditions&quot;)">
            <span>ПРАВИЛА ТА УМОВИ</span>
          </li>
          <li class="tab-item" wire:click="setActiveTab(&quot;bonus-terms&quot;)">
            <span>УМОВИ НАРАХУВАННЯ БОНУСІВ</span>
          </li>
          <li class="tab-item" wire:click="setActiveTab(&quot;responsible-game&quot;)">
            <span>ПОЛІТИКА ВІДПОВІДАЛЬНОСТІ</span>
          </li>
          <li class="tab-item" wire:click="setActiveTab(&quot;privacy-policy&quot;)">
            <span>ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ</span>
          </li>
          <li class="tab-item" wire:click="setActiveTab(&quot;fair-play&quot;)">
            <span>ПОЛІТИКА ЧЕСНОСТІ</span>
          </li>
        </ul>
      </div>
    `);
    supportTabs = new SupportTabsComponent(page, page.locator('.tabs'));
  });

  test('should be loaded', async () => {
    await expect(supportTabs.isLoaded()).resolves.toBeTruthy();
  });

  test('should get all tab names', async () => {
    const tabNames = await supportTabs.getAllTabNames();
    expect(tabNames).toEqual([
      'ПРАВИЛА ТА УМОВИ',
      'УМОВИ НАРАХУВАННЯ БОНУСІВ',
      'ПОЛІТИКА ВІДПОВІДАЛЬНОСТІ',
      'ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ',
      'ПОЛІТИКА ЧЕСНОСТІ'
    ]);
  });

  test('should get active tab name', async () => {
    await expect(supportTabs.getActiveTabName()).resolves.toBe('ПРАВИЛА ТА УМОВИ');
  });

  test('should get tab count', async () => {
    const count = await supportTabs.getTabCount();
    expect(count).toBe(5);
  });

  test('should check if specific tabs are active', async () => {
    await expect(supportTabs.isTermsAndConditionsTabActive()).resolves.toBeTruthy();
    await expect(supportTabs.isBonusTermsTabActive()).resolves.toBeFalsy();
    await expect(supportTabs.isResponsibleGameTabActive()).resolves.toBeFalsy();
    await expect(supportTabs.isPrivacyPolicyTabActive()).resolves.toBeFalsy();
    await expect(supportTabs.isFairPlayTabActive()).resolves.toBeFalsy();
  });

  test('should select terms and conditions tab', async () => {
    await supportTabs.selectTermsAndConditionsTab();
    await expect(supportTabs.isTermsAndConditionsTabActive()).resolves.toBeTruthy();
  });

  test('should select bonus terms tab', async () => {
    await supportTabs.selectBonusTermsTab();
    await expect(supportTabs.isBonusTermsTabActive()).resolves.toBeTruthy();
  });

  test('should select responsible game tab', async () => {
    await supportTabs.selectResponsibleGameTab();
    await expect(supportTabs.isResponsibleGameTabActive()).resolves.toBeTruthy();
  });

  test('should select privacy policy tab', async () => {
    await supportTabs.selectPrivacyPolicyTab();
    await expect(supportTabs.isPrivacyPolicyTabActive()).resolves.toBeTruthy();
  });

  test('should select fair play tab', async () => {
    await supportTabs.selectFairPlayTab();
    await expect(supportTabs.isFairPlayTabActive()).resolves.toBeTruthy();
  });

  test('should select tab by name', async () => {
    await supportTabs.selectTab('УМОВИ НАРАХУВАННЯ БОНУСІВ');
    await expect(supportTabs.isBonusTermsTabActive()).resolves.toBeTruthy();
  });

  test('should check if tab is active by name', async () => {
    await expect(supportTabs.isTabActive('ПРАВИЛА ТА УМОВИ')).resolves.toBeTruthy();
    await expect(supportTabs.isTabActive('УМОВИ НАРАХУВАННЯ БОНУСІВ')).resolves.toBeFalsy();
  });

  test('should navigate to next tab', async () => {
    await supportTabs.selectNextTab();
    await expect(supportTabs.isBonusTermsTabActive()).resolves.toBeTruthy();
  });

  test('should navigate to previous tab', async () => {
    await supportTabs.selectBonusTermsTab();
    await supportTabs.selectPreviousTab();
    await expect(supportTabs.isTermsAndConditionsTabActive()).resolves.toBeTruthy();
  });
});
