/**
 * Bonus Card Component Tests
 * Тесты для компонента карточки бонуса
 */

import { test, expect } from '@playwright/test';
import { BonusCardComponent } from '@components/atoms/bonus-card/bonus-card.component';

test.describe('Bonus Card Component', () => {
  let bonusCard: BonusCardComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <div class="card card-promotion card-unevenly">
        <div class="card-image-wrapper">
          <img src="https://example.com/bonus-image.jpg" alt="Bonus Image" class="card-image">
        </div>
        <div class="card-content-wrapper">
          <div class="title">Твій щасливий бонус 88%+88FS🌟</div>
          <div class="excerpt">
            ✨ Час сяяти разом зі Starlight Princess! ✨
            Роби депозит та забирай:
            💎 +88% до депозиту
            🎰 88 FS у грі Starlight Princess
            Не зволікай — твоя магія виграшів починається прямо зараз!
          </div>
          <div class="button-wrapper flex-wrap">
            <button type="button" class="btn btn-default btn-mob">Підписатися</button>
            <button type="button" class="btn btn-outline btn-mob">Детальна інформація</button>
          </div>
        </div>
      </div>
    `);
    
    bonusCard = new BonusCardComponent(page, page.locator('.card.card-promotion'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(bonusCard.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(bonusCard.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(bonusCard.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Information Retrieval', () => {
    test('should get title', async () => {
      const title = await bonusCard.getTitle();
      expect(title).toContain('щасливий бонус');
    });

    test('should get description', async () => {
      const description = await bonusCard.getDescription();
      expect(description).toContain('Starlight Princess');
    });

    test('should get image URL', async () => {
      const imageUrl = await bonusCard.getImageUrl();
      expect(imageUrl).toContain('bonus-image.jpg');
    });

    test('should get image alt text', async () => {
      const altText = await bonusCard.getImageAlt();
      expect(altText).toBe('Bonus Image');
    });
  });

  test.describe('Button Functionality', () => {
    test('should have subscribe button enabled', async () => {
      const isEnabled = await bonusCard.isSubscribeButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });

    test('should have details button enabled', async () => {
      const isEnabled = await bonusCard.isDetailsButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });

    test('should have subscribe button visible', async () => {
      const isVisible = await bonusCard.isSubscribeButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should have details button visible', async () => {
      const isVisible = await bonusCard.isDetailsButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should subscribe to bonus', async () => {
      await expect(bonusCard.subscribe()).resolves.not.toThrow();
    });

    test('should open details', async () => {
      await expect(bonusCard.openDetails()).resolves.not.toThrow();
    });
  });

  test.describe('State Checks', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await bonusCard.isCardFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should have image loaded', async () => {
      const isImageLoaded = await bonusCard.isImageLoaded();
      expect(isImageLoaded).toBeTruthy();
    });

    test('should have all buttons enabled', async () => {
      const areEnabled = await bonusCard.areAllButtonsEnabled();
      expect(areEnabled).toBeTruthy();
    });

    test('should have all buttons visible', async () => {
      const areVisible = await bonusCard.areAllButtonsVisible();
      expect(areVisible).toBeTruthy();
    });
  });

  test.describe('Text Search', () => {
    test('should contain text', async () => {
      const containsText = await bonusCard.containsText('бонус');
      expect(containsText).toBeTruthy();
    });

    test('should contain text in title', async () => {
      const containsText = await bonusCard.titleContainsText('щасливий');
      expect(containsText).toBeTruthy();
    });

    test('should contain text in description', async () => {
      const containsText = await bonusCard.descriptionContainsText('депозит');
      expect(containsText).toBeTruthy();
    });

    test('should not contain non-existent text', async () => {
      const containsText = await bonusCard.containsText('несуществующий текст');
      expect(containsText).toBeFalsy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing title', async () => {
      // Удаляем заголовок для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.title');
        if (element) element.remove();
      });
      
      const title = await bonusCard.getTitle();
      expect(title).toBe('');
    });

    test('should handle missing description', async () => {
      // Удаляем описание для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.excerpt');
        if (element) element.remove();
      });
      
      const description = await bonusCard.getDescription();
      expect(description).toBe('');
    });

    test('should handle missing image', async () => {
      // Удаляем изображение для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.card-image');
        if (element) element.remove();
      });
      
      const imageUrl = await bonusCard.getImageUrl();
      expect(imageUrl).toBe('');
    });

    test('should handle missing buttons', async () => {
      // Удаляем кнопки для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.button-wrapper');
        if (element) element.remove();
      });
      
      const areEnabled = await bonusCard.areAllButtonsEnabled();
      expect(areEnabled).toBeFalsy();
    });
  });

  test.describe('Multiple Cards', () => {
    test.beforeEach(async () => {
      // Создаем несколько карточек для тестирования
      await page.setContent(`
        <div class="bonus-cards">
          <div class="card card-promotion">
            <div class="title">Бонус 1</div>
            <div class="excerpt">Описание бонуса 1</div>
            <div class="button-wrapper">
              <button class="btn btn-default">Підписатися</button>
              <button class="btn btn-outline">Детальна інформація</button>
            </div>
          </div>
          <div class="card card-promotion">
            <div class="title">Бонус 2</div>
            <div class="excerpt">Описание бонуса 2</div>
            <div class="button-wrapper">
              <button class="btn btn-default">Підписатися</button>
              <button class="btn btn-outline">Детальна інформація</button>
            </div>
          </div>
        </div>
      `);
    });

    test('should work with multiple cards', async () => {
      const card1 = new BonusCardComponent(page, page.locator('.card.card-promotion').nth(0));
      const card2 = new BonusCardComponent(page, page.locator('.card.card-promotion').nth(1));
      
      const title1 = await card1.getTitle();
      const title2 = await card2.getTitle();
      
      expect(title1).toBe('Бонус 1');
      expect(title2).toBe('Бонус 2');
    });
  });
});
