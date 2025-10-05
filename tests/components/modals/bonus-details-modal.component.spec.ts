/**
 * Bonus Details Modal Component Tests
 * Тесты для модального окна детальной информации о бонусе
 */

import { test, expect } from '@playwright/test';
import { BonusDetailsModalComponent } from '@components/modals/bonus-details-modal/bonus-details-modal.component';

test.describe('Bonus Details Modal Component', () => {
  let bonusModal: BonusDetailsModalComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <div class="modal-dialog modal-dialog-sm">
        <div class="modal-content pb-lg">
          <div class="modal-header">
            <div class="modal-header-inner">
              <h4 class="modal-title">Детальна інформація</h4>
            </div>
            <img src="/close.svg" alt="" class="icon modal-close-alpine">
          </div>
          <div class="modal-body text-white body-max pb-0">
            <img src="https://example.com/bonus-banner.jpg" alt="Bonus Banner" class="round-lg image-cover" style="max-height: 300px">
            
            <div class="flex-col gap-xs">
              <div class="row-card">
                <h3 class="row-card-col my-0">Твій щасливий бонус 88%+88FS🌟</h3>
              </div>
              <div class="collapse collapse-thin open">
                <div class="collapse-question" onclick="toggleCollapse(this)">
                  Умови бонусу:
                  <span class="icon">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5.6731L8.70711 10.966C8.31658 11.3565 7.68342 11.3565 7.29289 10.966L2 5.6731" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  </span>
                </div>
                <div class="collapse-answer flex-col gap-lg">
                  <div>
                    ✨ Час сяяти разом зі Starlight Princess! ✨
                    Роби депозит та забирай:
                    💎 +88% до депозиту
                    🎰 88 FS у грі Starlight Princess
                    Не зволікай — твоя магія виграшів починається прямо зараз!
                  </div>
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
                </div>
              </div>
            </div>

            <div class="flex-col gap-xs">
              <div class="row-card">
                <h3 class="row-card-col my-0">88 FS на Starlight Princess</h3>
              </div>
              <div class="collapse collapse-thin open">
                <div class="collapse-question" onclick="toggleCollapse(this)">
                  Умови бонусу:
                  <span class="icon">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5.6731L8.70711 10.966C8.31658 11.3565 7.68342 11.3565 7.29289 10.966L2 5.6731" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  </span>
                </div>
                <div class="collapse-answer flex-col gap-lg">
                  <div>
                    Забирай 88 обертань у Starlight Princess для твого великого виграшу!
                  </div>
                  <ul class="flex-col gap-lg body-semibold">
                    <li>
                      <div class="list-wrapper">
                        <div class="list-item"></div>
                        <div class="list-item-text">Wager: x40</div>
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
                    <li>
                      <div class="list-wrapper">
                        <div class="list-item"></div>
                        <div class="list-item-text">Ставка на один FS: 8 UAH</div>
                      </div>
                    </li>
                    <li>
                      <div class="list-wrapper">
                        <div class="list-item"></div>
                        <div class="list-item-text">Макс. Бонус: 500 UAH</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex-row-center">
              <button type="button" class="btn mx-auto btn-default">Підписатися</button>
            </div>
          </div>
        </div>
      </div>
    `);
    
    bonusModal = new BonusDetailsModalComponent(page, page.locator('.modal-dialog'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(bonusModal.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(bonusModal.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(bonusModal.waitForLoad()).resolves.not.toThrow();
    });

    test('should close modal', async () => {
      await bonusModal.close();
      await expect(bonusModal.isVisible()).resolves.toBeFalsy();
    });
  });

  test.describe('Bonus Information', () => {
    test('should get bonus title', async () => {
      const title = await bonusModal.getBonusTitle();
      expect(title).toContain('щасливий бонус');
    });

    test('should get bonus description', async () => {
      const description = await bonusModal.getBonusDescription();
      expect(description).toContain('Starlight Princess');
    });

    test('should get bonus image URL', async () => {
      const imageUrl = await bonusModal.getBonusImageUrl();
      expect(imageUrl).toContain('bonus-banner.jpg');
    });

    test('should get bonus image alt text', async () => {
      const altText = await bonusModal.getBonusImageAlt();
      expect(altText).toBe('Bonus Banner');
    });
  });

  test.describe('Collapse Functionality', () => {
    test('should expand bonus conditions', async () => {
      await bonusModal.expandBonusConditions();
      await expect(bonusModal.isBonusConditionsExpanded()).resolves.toBeTruthy();
    });

    test('should collapse bonus conditions', async () => {
      await bonusModal.expandBonusConditions();
      await bonusModal.collapseBonusConditions();
      await expect(bonusModal.isBonusConditionsExpanded()).resolves.toBeFalsy();
    });

    test('should expand free spins conditions', async () => {
      await bonusModal.expandFreeSpinsConditions();
      await expect(bonusModal.isFreeSpinsConditionsExpanded()).resolves.toBeTruthy();
    });

    test('should collapse free spins conditions', async () => {
      await bonusModal.expandFreeSpinsConditions();
      await bonusModal.collapseFreeSpinsConditions();
      await expect(bonusModal.isFreeSpinsConditionsExpanded()).resolves.toBeFalsy();
    });
  });

  test.describe('Bonus Conditions', () => {
    test('should get all bonus conditions', async () => {
      const conditions = await bonusModal.getBonusConditions();
      expect(conditions.length).toBeGreaterThan(0);
      expect(conditions).toContain('Мінімальна сума депозиту: 500 UAH');
    });

    test('should get bonus condition by index', async () => {
      const condition = await bonusModal.getBonusConditionByIndex(0);
      expect(condition).toContain('Мінімальна сума депозиту');
    });

    test('should get all free spins conditions', async () => {
      const conditions = await bonusModal.getFreeSpinsConditions();
      expect(conditions.length).toBeGreaterThan(0);
      expect(conditions).toContain('Wager: x40');
    });

    test('should get free spins condition by index', async () => {
      const condition = await bonusModal.getFreeSpinsConditionByIndex(0);
      expect(condition).toContain('Wager');
    });
  });

  test.describe('Subscribe Functionality', () => {
    test('should have subscribe button enabled', async () => {
      const isEnabled = await bonusModal.isSubscribeButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });

    test('should have subscribe button visible', async () => {
      const isVisible = await bonusModal.isSubscribeButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should subscribe to bonus', async () => {
      await expect(bonusModal.subscribe()).resolves.not.toThrow();
    });
  });

  test.describe('State Checks', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await bonusModal.isModalFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should have image loaded', async () => {
      const isImageLoaded = await bonusModal.isBonusImageLoaded();
      expect(isImageLoaded).toBeTruthy();
    });

    test('should have all collapses expanded', async () => {
      const areExpanded = await bonusModal.areAllCollapsesExpanded();
      expect(areExpanded).toBeTruthy();
    });

    test('should have all conditions visible', async () => {
      const areVisible = await bonusModal.areAllConditionsVisible();
      expect(areVisible).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing elements', async () => {
      // Удаляем элемент для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.bonus-title');
        if (element) element.remove();
      });
      
      const title = await bonusModal.getBonusTitle();
      expect(title).toBe('');
    });

    test('should handle missing image', async () => {
      // Удаляем изображение для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.round-lg.image-cover');
        if (element) element.remove();
      });
      
      const imageUrl = await bonusModal.getBonusImageUrl();
      expect(imageUrl).toBe('');
    });

    test('should handle missing conditions', async () => {
      // Удаляем условия для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.collapse ul');
        if (element) element.remove();
      });
      
      const conditions = await bonusModal.getBonusConditions();
      expect(conditions.length).toBe(0);
    });
  });
});
