/**
 * User Statistics Component Tests
 * Тесты для компонента статистики пользователя
 */

import { test, expect } from '@playwright/test';
import { UserStatisticsComponent } from '@components/molecules/user-statistics';

test.describe('UserStatisticsComponent', () => {
  let userStatistics: UserStatisticsComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div class="modal-body-inner">
        <div class="row-card">
          <div class="row-card-col">
            <span class="icon-lg text-white">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.43575 5.59265H2.74857C3.19985 5.59265 3.56908 5.93193 3.56908 6.36374V13.0105C3.56908 13.4346 3.19985 13.7816 2.74857 13.7816H1.43575C0.984465 13.7816 0.615234 13.4346 0.615234 13.0105V6.36374C0.615234 5.93964 0.984465 5.59265 1.43575 5.59265ZM7.34344 3.13287H8.65626C9.10754 3.13287 9.47677 3.47986 9.47677 3.90396V13.0105C9.47677 13.4346 9.10754 13.7816 8.65626 13.7816H7.34344C6.89216 13.7816 6.52293 13.4346 6.52293 13.0105V3.90396C6.52293 3.47986 6.89216 3.13287 7.34344 3.13287ZM13.2511 0.673096H14.564C15.0152 0.673096 15.3845 1.02009 15.3845 1.44419V13.0105C15.3845 13.4346 15.0152 13.7816 14.564 13.7816H13.2511C12.7998 13.7816 12.4306 13.4346 12.4306 13.0105V1.44419C12.4306 1.02009 12.7998 0.673096 13.2511 0.673096ZM0.615385 16.6731H15.3846C15.721 16.6731 16 16.4109 16 16.0948C16 15.7786 15.721 15.5165 15.3846 15.5165H0.615385C0.278974 15.5165 0 15.7786 0 16.0948C0 16.4109 0.278974 16.6731 0.615385 16.6731Z" fill="currentColor"></path>
              </svg>
            </span>
            <div class="text-white">Статистика</div>
          </div>
          <div class="row-card-col">
            <span class="btn btn-link" wire:click="changeContent('history')">
              <span>Деталі</span>
              <span class="icon">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.13891 3.0885C5.74579 2.71411 5.11134 2.71411 4.71823 3.0885C4.32095 3.46686 4.32095 4.08351 4.71823 4.46188L9.14007 8.67315L4.71823 12.8844C4.32095 13.2628 4.32095 13.8794 4.71823 14.2578C5.11134 14.6322 5.74579 14.6322 6.13891 14.2578L11.2818 9.35984C11.679 8.98147 11.679 8.36482 11.2818 7.98646L6.13891 3.0885Z" fill="white" stroke="white" stroke-width="0.302315" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </span>
          </div>
        </div>
        <div class="flex-inner-auto--3">
          <div class="content-block">
            <div class="content-block-heading">Загальна кількість виграшів</div>
            <div class="content-block-total">
              <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/tabconfetti.svg" alt="" class="icon">
              <span>0,00</span>
            </div>
          </div>
          <div class="content-block">
            <div class="content-block-heading">Всього ставок</div>
            <div class="content-block-total">
              <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/tabchip.svg" alt="" class="icon">
              <span>0,00</span>
            </div>
          </div>
          <div class="content-block">
            <div class="content-block-heading">Всього використано в ставках</div>
            <div class="content-block-total">
              <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/moneybag.svg" alt="" class="icon">
              <span>0,00</span>
            </div>
          </div>
        </div>
      </div>
    `);
    userStatistics = new UserStatisticsComponent(page, page.locator('.modal-body-inner'));
  });

  test('should be loaded', async () => {
    await expect(userStatistics.isLoaded()).resolves.toBeTruthy();
  });

  test('should get statistics title', async () => {
    await expect(userStatistics.getStatisticsTitle()).resolves.toBe('Статистика');
  });

  test('should get total winnings', async () => {
    await expect(userStatistics.getTotalWinnings()).resolves.toBe('0,00');
  });

  test('should get total bets', async () => {
    await expect(userStatistics.getTotalBets()).resolves.toBe('0,00');
  });

  test('should get total used in bets', async () => {
    await expect(userStatistics.getTotalUsedInBets()).resolves.toBe('0,00');
  });

  test('should get full statistics', async () => {
    const statistics = await userStatistics.getStatistics();
    expect(statistics.totalWinnings).toBe('0,00');
    expect(statistics.totalBets).toBe('0,00');
    expect(statistics.totalUsedInBets).toBe('0,00');
  });

  test('should show details', async () => {
    await userStatistics.showDetails();
    await expect(userStatistics.detailsButton.root).toBeEnabled();
  });

  test('should click statistics title', async () => {
    await userStatistics.clickStatisticsTitle();
    await expect(userStatistics.statisticsTitle).toBeVisible();
  });

  test('should click total winnings block', async () => {
    await userStatistics.clickTotalWinningsBlock();
    await expect(userStatistics.totalWinningsBlock).toBeVisible();
  });

  test('should click total bets block', async () => {
    await userStatistics.clickTotalBetsBlock();
    await expect(userStatistics.totalBetsBlock).toBeVisible();
  });

  test('should click total used block', async () => {
    await userStatistics.clickTotalUsedBlock();
    await expect(userStatistics.totalUsedBlock).toBeVisible();
  });

  test('should check if statistics title is visible', async () => {
    await expect(userStatistics.isStatisticsTitleVisible()).resolves.toBeTruthy();
  });

  test('should check if details button is enabled', async () => {
    await expect(userStatistics.isDetailsButtonEnabled()).resolves.toBeTruthy();
  });

  test('should check if statistics blocks are visible', async () => {
    await expect(userStatistics.areStatisticsBlocksVisible()).resolves.toBeTruthy();
  });

  test('should check if total winnings block is visible', async () => {
    await expect(userStatistics.isTotalWinningsBlockVisible()).resolves.toBeTruthy();
  });

  test('should check if total bets block is visible', async () => {
    await expect(userStatistics.isTotalBetsBlockVisible()).resolves.toBeTruthy();
  });

  test('should check if total used block is visible', async () => {
    await expect(userStatistics.isTotalUsedBlockVisible()).resolves.toBeTruthy();
  });

  test('should check if statistics values are filled', async () => {
    await expect(userStatistics.areStatisticsValuesFilled()).resolves.toBeTruthy();
  });

  test('should check if statistics values are numeric', async () => {
    await expect(userStatistics.areStatisticsValuesNumeric()).resolves.toBeTruthy();
  });

  test('should get statistics blocks count', async () => {
    const count = await userStatistics.getStatisticsBlocksCount();
    expect(count).toBe(3);
  });

  test('should get statistics block headings', async () => {
    const headings = await userStatistics.getStatisticsBlockHeadings();
    expect(headings).toEqual([
      'Загальна кількість виграшів',
      'Всього ставок',
      'Всього використано в ставках'
    ]);
  });

  test('should get statistics block values', async () => {
    const values = await userStatistics.getStatisticsBlockValues();
    expect(values).toEqual(['0,00', '0,00', '0,00']);
  });
});
