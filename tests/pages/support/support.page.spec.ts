/**
 * Support Page Tests
 * Тесты для страницы центра поддержки
 */

import { test, expect } from '@playwright/test';
import { SupportPage } from '@pages/support/support.page';
import { Routes } from '../../config/routes';

test.describe('Support Page', () => {
  let supportPage: SupportPage;

  test.beforeEach(async ({ page }) => {
    supportPage = new SupportPage(page);
    // Mock the HTML content for the support page
    await page.setContent(`
      <div wire:id="apIN52nhO6IOdaGp1hSR" class="container">
        <div class="row mb-4xl">
          <div class="page-title">
            Центр допомоги
          </div>
        </div>
        <div class="container-term">
          <div class="row">
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
          </div>
          <div class="row flex-col gap-lg text-white">
            <h3 class="my-0">ПРАВИЛА ОРГАНІЗАТОРА АЗАРТНИХ ІГОР КАЗИНО В МЕРЕЖІ ІНТЕРНЕТ "Luckycoin"</h3>
            <h4 class="my-0">Основні терміни</h4>
            <p>Вебсайт організатора азартних ігор — це одна вебсторінка або набір вебсторінок, через які Організатор здійснює свою діяльність в Інтернеті, використовуючи виключно один бренд.</p>
            <p>Азартна гра — це гра, участь у якій передбачає внесення Гравцем ставки, що надає право на отримання виграшу (призу). Ймовірність отримання виграшу та його розмір залежать повністю або частково від випадковості, а також від знань і майстерності Гравця.</p>
            <h4 class="my-0">Загальні положення та умови</h4>
            <p>1.1 Умови та документи зазначені нижче, застосовуються для врегулювання відносин між Організатором («luckycoin.gold») та клієнтом (гравцем) під час використання Веб-сайту («luckycoin.gold») а також пов'язаних служб (разом іменуються "Сервіс") які відповідають вимогам, визначеним Законом України «Про державне регулювання діяльності щодо організації та проведення азартних ігор».</p>
            <h4 class="my-0">Відповідальність гравців</h4>
            <p>2.1 Гравцем може бути лише фізична особа, яка на момент участі в азартній грі досягла 18-річного віку. Організатор не має права приймати ставки або виплачувати (видавати) виграші (призи) особам, які не досягли 18 років.</p>
            <ul>
              <li>Особи, які не досягли 18-річного віку.</li>
              <li>Особи, на яких поширюються відповідні обмеження згідно із законодавством.</li>
              <li>Особи, які визнані Організатором азартних ігор небажаними.</li>
            </ul>
          </div>
        </div>
      </div>
    `);
    await supportPage.waitForLoad();
  });

  test('should load successfully and display page title', async () => {
    await expect(supportPage.isLoaded()).resolves.toBeTruthy();
    await expect(supportPage.getPageTitle()).resolves.toBe('Центр допомоги');
  });

  test('should display support tabs and allow switching', async () => {
    await expect(supportPage.supportTabs.isLoaded()).resolves.toBeTruthy();
    const tabNames = await supportPage.supportTabs.getAllTabNames();
    expect(tabNames).toEqual([
      'ПРАВИЛА ТА УМОВИ',
      'УМОВИ НАРАХУВАННЯ БОНУСІВ',
      'ПОЛІТИКА ВІДПОВІДАЛЬНОСТІ',
      'ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ',
      'ПОЛІТИКА ЧЕСНОСТІ'
    ]);

    await expect(supportPage.supportTabs.isTermsAndConditionsTabActive()).resolves.toBeTruthy();

    await supportPage.switchToBonusTermsTab();
    await expect(supportPage.supportTabs.isBonusTermsTabActive()).resolves.toBeTruthy();
    await expect(supportPage.supportTabs.isTermsAndConditionsTabActive()).resolves.toBeFalsy();

    await supportPage.switchToResponsibleGameTab();
    await expect(supportPage.supportTabs.isResponsibleGameTabActive()).resolves.toBeTruthy();
  });

  test('should display support content with sections', async () => {
    await expect(supportPage.supportContent.isLoaded()).resolves.toBeTruthy();
    const headers = await supportPage.getAllSectionHeaders();
    expect(headers).toContain('Основні терміни');
    expect(headers).toContain('Загальні положення та умови');
    expect(headers).toContain('Відповідальність гравців');

    const sectionsCount = await supportPage.getSectionsCount();
    expect(sectionsCount).toBeGreaterThan(0);
  });

  test('should find sections by header text', async () => {
    await expect(supportPage.findSectionByHeader('Основні терміни')).resolves.toBeTruthy();
    await expect(supportPage.findSectionByHeader('Загальні положення та умови')).resolves.toBeTruthy();
    await expect(supportPage.findSectionByHeader('Відповідальність гравців')).resolves.toBeTruthy();
  });

  test('should get current tab content', async () => {
    const content = await supportPage.getCurrentTabContent();
    expect(content).toContain('ПРАВИЛА ОРГАНІЗАТОРА АЗАРТНИХ ІГОР КАЗИНО В МЕРЕЖІ ІНТЕРНЕТ "Luckycoin"');
    expect(content).toContain('Основні терміни');
    expect(content).toContain('Загальні положення та умови');
  });

  test('should get full page info', async () => {
    const pageInfo = await supportPage.getFullPageInfo();
    expect(pageInfo.pageTitle).toBe('Центр допомоги');
    expect(pageInfo.activeTab).toBe('ПРАВИЛА ТА УМОВИ');
    expect(pageInfo.sectionsCount).toBeGreaterThan(0);
    expect(pageInfo.headers.length).toBeGreaterThan(0);
    expect(pageInfo.isLoaded).toBeTruthy();
  });

  test('should navigate between tabs', async () => {
    await supportPage.switchToBonusTermsTab();
    await expect(supportPage.supportTabs.getActiveTabName()).resolves.toBe('УМОВИ НАРАХУВАННЯ БОНУСІВ');

    await supportPage.switchToResponsibleGameTab();
    await expect(supportPage.supportTabs.getActiveTabName()).resolves.toBe('ПОЛІТИКА ВІДПОВІДАЛЬНОСТІ');

    await supportPage.switchToPrivacyPolicyTab();
    await expect(supportPage.supportTabs.getActiveTabName()).resolves.toBe('ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ');

    await supportPage.switchToFairPlayTab();
    await expect(supportPage.supportTabs.getActiveTabName()).resolves.toBe('ПОЛІТИКА ЧЕСНОСТІ');
  });

  test('should check if content is loaded', async () => {
    await expect(supportPage.isContentLoaded()).resolves.toBeTruthy();
  });
});
