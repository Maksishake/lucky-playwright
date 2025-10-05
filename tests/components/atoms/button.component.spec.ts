/**
 * Button Component Tests
 * Тесты атомарного компонента кнопки
 */

import { test, expect } from '@playwright/test';
import { ButtonComponent } from '../../../src/components/atoms/button/button.component';

test.describe('Button Component', () => {
  test('should be clickable', async ({ page }) => {
    // Создаем тестовую HTML страницу
    await page.setContent(`
      <html>
        <body>
          <button id="test-button">Click Me</button>
        </body>
      </html>
    `);

    const button = new ButtonComponent(page, page.locator('#test-button'), 'Test Button');
    
    await expect(button.isVisible()).resolves.toBe(true);
    await expect(button.isEnabled()).resolves.toBe(true);
    
    await button.click();
    
    await expect(button.getText()).resolves.toBe('Click Me');
  });

  test('should be disabled when disabled', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="disabled-button" disabled>Disabled Button</button>
        </body>
      </html>
    `);

    const button = new ButtonComponent(page, page.locator('#disabled-button'), 'Disabled Button');
    
    await expect(button.isDisabled()).resolves.toBe(true);
    await expect(button.isEnabled()).resolves.toBe(false);
  });

  test('should get button info', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="info-button" type="submit" class="active">Submit</button>
        </body>
      </html>
    `);

    const button = new ButtonComponent(page, page.locator('#info-button'), 'Info Button');
    
    const info = await button.getButtonInfo();
    
    expect(info.text).toBe('Submit');
    expect(info.isEnabled).toBe(true);
    expect(info.isActive).toBe(true);
    expect(info.type).toBe('submit');
  });
});
