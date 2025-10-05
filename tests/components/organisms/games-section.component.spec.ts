/**
 * Games Section Component Tests
 * Тесты организма секции игр
 */

import { test, expect } from '@playwright/test';
import { GamesSectionComponent } from '../../../src/components/organisms/games-section/games-section.component';

test.describe('Games Section Component', () => {
  test('should display games', async ({ page }) => {
    // Создаем тестовую HTML страницу с играми
    await page.setContent(`
      <html>
        <body>
          <div id="games-section">
            <div class="search-bar">
              <input type="search" placeholder="Search games..." />
              <button class="filter-button">Filter</button>
            </div>
            <div class="games-grid">
              <div class="game-card">
                <h3 class="game-title">Slot Game 1</h3>
                <p class="game-provider">Provider 1</p>
                <button class="play-button">Play</button>
              </div>
              <div class="game-card">
                <h3 class="game-title">Slot Game 2</h3>
                <p class="game-provider">Provider 2</p>
                <button class="play-button">Play</button>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    const gamesSection = new GamesSectionComponent(page, page.locator('#games-section'), 'Games Section');
    
    await expect(gamesSection.isVisible()).resolves.toBe(true);
    await expect(gamesSection.areGamesLoaded()).resolves.toBe(true);
    await expect(gamesSection.getChildCount()).resolves.toBe(2);
  });

  test('should search games', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="games-section">
            <div class="search-bar">
              <input type="search" placeholder="Search games..." />
              <button class="filter-button">Filter</button>
            </div>
            <div class="games-grid">
              <div class="game-card">
                <h3 class="game-title">Slot Game 1</h3>
                <p class="game-provider">Provider 1</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    const gamesSection = new GamesSectionComponent(page, page.locator('#games-section'), 'Games Section');
    
    await gamesSection.searchGames('Slot Game 1');
    
    const searchQuery = await gamesSection.getSearchBar().getText();
    expect(searchQuery).toBe('Slot Game 1');
  });

  test('should get games info', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="games-section">
            <div class="search-bar">
              <input type="search" placeholder="Search games..." />
            </div>
            <div class="games-grid">
              <div class="game-card">
                <h3 class="game-title">Slot Game 1</h3>
                <p class="game-provider">Provider 1</p>
              </div>
              <div class="game-card">
                <h3 class="game-title">Slot Game 2</h3>
                <p class="game-provider">Provider 2</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    const gamesSection = new GamesSectionComponent(page, page.locator('#games-section'), 'Games Section');
    
    const info = await gamesSection.getGamesSectionInfo();
    
    expect(info.gamesCount).toBe(2);
    expect(info.gameTitles).toContain('Slot Game 1');
    expect(info.gameTitles).toContain('Slot Game 2');
    expect(info.gameProviders).toContain('Provider 1');
    expect(info.gameProviders).toContain('Provider 2');
    expect(info.isLoaded).toBe(true);
  });
});
