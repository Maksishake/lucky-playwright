/**
 * Collapse Component Tests
 * Тесты для компонента коллапса
 */

import { test, expect } from '@playwright/test';
import { CollapseComponent } from '@components/molecules/collapse/collapse.component';

test.describe('Collapse Component', () => {
  let collapse: CollapseComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
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
          </ul>
        </div>
      </div>
    `);
    
    collapse = new CollapseComponent(page, page.locator('.collapse'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(collapse.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(collapse.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(collapse.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Collapse Actions', () => {
    test('should expand collapse', async () => {
      await collapse.collapse();
      await collapse.expand();
      await expect(collapse.isExpanded()).resolves.toBeTruthy();
    });

    test('should collapse', async () => {
      await collapse.expand();
      await collapse.collapse();
      await expect(collapse.isCollapsed()).resolves.toBeTruthy();
    });

    test('should toggle collapse', async () => {
      const initialState = await collapse.isExpanded();
      await collapse.toggle();
      const newState = await collapse.isExpanded();
      expect(newState).toBe(!initialState);
    });

    test('should check if expanded', async () => {
      const isExpanded = await collapse.isExpanded();
      expect(isExpanded).toBeTruthy(); // В моке коллапс открыт
    });

    test('should check if collapsed', async () => {
      await collapse.collapse();
      const isCollapsed = await collapse.isCollapsed();
      expect(isCollapsed).toBeTruthy();
    });
  });

  test.describe('Text Retrieval', () => {
    test('should get question text', async () => {
      const questionText = await collapse.getQuestionText();
      expect(questionText).toContain('Умови бонусу');
    });

    test('should get answer text', async () => {
      const answerText = await collapse.getAnswerText();
      expect(answerText).toContain('Starlight Princess');
    });

    test('should get all text', async () => {
      const allText = await collapse.getAllText();
      expect(allText).toContain('Умови бонусу');
      expect(allText).toContain('Starlight Princess');
    });
  });

  test.describe('Icon Functionality', () => {
    test('should get icon direction', async () => {
      const direction = await collapse.getIconDirection();
      expect(direction).toBe('up'); // В моке коллапс открыт
    });

    test('should check if icon is visible', async () => {
      const isVisible = await collapse.isIconVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('State Checks', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await collapse.isCollapseFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should be clickable', async () => {
      const isClickable = await collapse.isClickable();
      expect(isClickable).toBeTruthy();
    });

    test('should have content visible', async () => {
      const isContentVisible = await collapse.isContentVisible();
      expect(isContentVisible).toBeTruthy();
    });
  });

  test.describe('Text Search', () => {
    test('should contain text', async () => {
      const containsText = await collapse.containsText('бонусу');
      expect(containsText).toBeTruthy();
    });

    test('should contain text in question', async () => {
      const containsText = await collapse.questionContainsText('Умови');
      expect(containsText).toBeTruthy();
    });

    test('should contain text in answer', async () => {
      const containsText = await collapse.answerContainsText('депозиту');
      expect(containsText).toBeTruthy();
    });

    test('should not contain non-existent text', async () => {
      const containsText = await collapse.containsText('несуществующий текст');
      expect(containsText).toBeFalsy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing question', async () => {
      // Удаляем вопрос для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.collapse-question');
        if (element) element.remove();
      });
      
      const questionText = await collapse.getQuestionText();
      expect(questionText).toBe('');
    });

    test('should handle missing answer', async () => {
      // Удаляем ответ для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.collapse-answer');
        if (element) element.remove();
      });
      
      const answerText = await collapse.getAnswerText();
      expect(answerText).toBe('');
    });

    test('should handle missing icon', async () => {
      // Удаляем иконку для тестирования обработки ошибок
      await page.evaluate(() => {
        const element = document.querySelector('.icon');
        if (element) element.remove();
      });
      
      const isIconVisible = await collapse.isIconVisible();
      expect(isIconVisible).toBeFalsy();
    });
  });

  test.describe('Multiple Collapses', () => {
    test.beforeEach(async () => {
      // Создаем несколько коллапсов для тестирования
      await page.setContent(`
        <div class="collapses">
          <div class="collapse collapse-thin open">
            <div class="collapse-question">Вопрос 1</div>
            <div class="collapse-answer">Ответ 1</div>
          </div>
          <div class="collapse collapse-thin">
            <div class="collapse-question">Вопрос 2</div>
            <div class="collapse-answer">Ответ 2</div>
          </div>
        </div>
      `);
    });

    test('should work with multiple collapses', async () => {
      const collapse1 = new CollapseComponent(page, page.locator('.collapse').nth(0));
      const collapse2 = new CollapseComponent(page, page.locator('.collapse').nth(1));
      
      const isExpanded1 = await collapse1.isExpanded();
      const isExpanded2 = await collapse2.isExpanded();
      
      expect(isExpanded1).toBeTruthy();
      expect(isExpanded2).toBeFalsy();
    });
  });
});
