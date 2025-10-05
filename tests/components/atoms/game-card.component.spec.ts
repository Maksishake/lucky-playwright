/**
 * Game Card Component Tests
 * Тесты для компонента карточки игры
 */

import { test, expect } from '@playwright/test';
import { GameCardComponent } from '@components/atoms/game-card';

test.describe('GameCardComponent', () => {
  let gameCard: GameCardComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div class="game-card game-card-orange">
        <img src="https://luckycoin777.live/storage/covers/vertical/pragmatic-play_sweet-bonanza.webp" loading="lazy" alt="Sweet Bonanza" class="img">
        <div class="game-card-hover">
          <div class="title">Sweet Bonanza</div>
          <button type="button" class="btn btn-icon btn-icon-md bg-orange text-white" wire:click="toggleFavorite">
            <span class="icon">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_39_1845)">
                  <path d="M16 6.87339C16 6.62468 15.8206 6.47012 15.4614 6.40956L10.6346 5.67371L8.47122 1.08639C8.3495 0.810815 8.19232 0.673096 8.00005 0.673096C7.80781 0.673096 7.65073 0.810815 7.52892 1.08639L5.36538 5.67371L0.538391 6.40956C0.179508 6.47012 0 6.62468 0 6.87339C0 7.0146 0.0801558 7.17591 0.240434 7.35738L3.74048 10.9264L2.91356 15.9672C2.90073 16.0613 2.89436 16.1288 2.89436 16.1689C2.89436 16.31 2.92798 16.4293 2.99527 16.5268C3.06252 16.6245 3.16342 16.6731 3.29811 16.6731C3.41356 16.6731 3.54171 16.6329 3.68272 16.5522L7.99995 14.1726L12.3175 16.5522C12.4523 16.6329 12.5805 16.6731 12.702 16.6731C12.8306 16.6731 12.9281 16.6245 12.9954 16.5268C13.0625 16.4294 13.0961 16.31 13.0961 16.1689C13.0961 16.0816 13.0929 16.0144 13.0865 15.9672L12.2595 10.9264L15.7499 7.35738C15.9168 7.18262 16 7.02124 16 6.87339Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_39_1845">
                    <rect width="16" height="16" fill="currentColor" transform="translate(0 0.673096)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </span>
          </button>
          <div class="buttons">
            <button class="btn btn-default" wire:click="startGame('real')">Реальний</button>
            <button class="btn btn-secondary" wire:click="startGame('demo')">Демо</button>
          </div>
          <div class="subtitle">Pragmatic Play</div>
        </div>
      </div>
    `);
    gameCard = new GameCardComponent(page, page.locator('.game-card'));
  });

  test('should be loaded', async () => {
    await expect(gameCard.isLoaded()).resolves.toBeTruthy();
  });

  test('should get game title', async () => {
    await expect(gameCard.getTitle()).resolves.toBe('Sweet Bonanza');
  });

  test('should get game provider', async () => {
    await expect(gameCard.getProvider()).resolves.toBe('Pragmatic Play');
  });

  test('should get game image URL', async () => {
    await expect(gameCard.getImageUrl()).resolves.toContain('sweet-bonanza.webp');
  });

  test('should get game image alt text', async () => {
    await expect(gameCard.getImageAlt()).resolves.toBe('Sweet Bonanza');
  });

  test('should get full game info', async () => {
    const gameInfo = await gameCard.getGameInfo();
    expect(gameInfo.title).toBe('Sweet Bonanza');
    expect(gameInfo.provider).toBe('Pragmatic Play');
    expect(gameInfo.imageUrl).toContain('sweet-bonanza.webp');
    expect(gameInfo.imageAlt).toBe('Sweet Bonanza');
    expect(gameInfo.isFavorite).toBeTruthy();
  });

  test('should toggle favorite', async () => {
    await gameCard.toggleFavorite();
    await expect(gameCard.favoriteButton.root).toBeEnabled();
  });

  test('should play real game', async () => {
    await gameCard.playReal();
    await expect(gameCard.realButton.root).toBeEnabled();
  });

  test('should play demo game', async () => {
    await gameCard.playDemo();
    await expect(gameCard.demoButton.root).toBeEnabled();
  });

  test('should click image', async () => {
    await gameCard.clickImage();
    await expect(gameCard.gameImage).toBeVisible();
  });

  test('should click title', async () => {
    await gameCard.clickTitle();
    await expect(gameCard.gameTitle).toBeVisible();
  });

  test('should check if game is favorite', async () => {
    await expect(gameCard.isFavorite()).resolves.toBeTruthy();
  });

  test('should check if favorite button is enabled', async () => {
    await expect(gameCard.isFavoriteButtonEnabled()).resolves.toBeTruthy();
  });

  test('should check if real button is enabled', async () => {
    await expect(gameCard.isRealButtonEnabled()).resolves.toBeTruthy();
  });

  test('should check if demo button is enabled', async () => {
    await expect(gameCard.isDemoButtonEnabled()).resolves.toBeTruthy();
  });

  test('should check if image is loaded', async () => {
    await expect(gameCard.isImageLoaded()).resolves.toBeTruthy();
  });

  test('should check if title is visible', async () => {
    await expect(gameCard.isTitleVisible()).resolves.toBeTruthy();
  });

  test('should check if provider is visible', async () => {
    await expect(gameCard.isProviderVisible()).resolves.toBeTruthy();
  });

  test('should check if all elements are loaded', async () => {
    await expect(gameCard.areAllElementsLoaded()).resolves.toBeTruthy();
  });

  test('should check if game is ready to play', async () => {
    await expect(gameCard.isGameReadyToPlay()).resolves.toBeTruthy();
  });

  test('should get image size', async () => {
    const size = await gameCard.getImageSize();
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  test('should get card styles', async () => {
    const styles = await gameCard.getCardStyles();
    expect(styles).toHaveProperty('backgroundColor');
    expect(styles).toHaveProperty('borderRadius');
    expect(styles).toHaveProperty('boxShadow');
  });
});
