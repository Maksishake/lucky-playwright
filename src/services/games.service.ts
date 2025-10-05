/**
 * Games Service
 * Бизнес-логика для работы с играми
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { GamesSectionComponent } from '@pages/common/games-section.component';
import { logger } from '@utils/logger.util';

export class GamesService extends BaseService {
  private gamesSection: GamesSectionComponent;

  constructor(page: Page) {
    super(page);
    this.gamesSection = new GamesSectionComponent(page);
  }

  /**
   * Получить все игры на странице
   */
  async getAllGames(): Promise<Array<{ title: string | null; provider: string | null; index: number }>> {
    this.logStep('Getting all games');
    const games = await this.gamesSection.getAllGamesInfo();
    this.logSuccess(`Found ${games.length} games`);
    return games;
  }

  /**
   * Получить количество игр
   */
  async getGamesCount(): Promise<number> {
    this.logStep('Getting games count');
    const count = await this.gamesSection.getGamesCount();
    this.logSuccess(`Games count: ${count}`);
    return count;
  }

  /**
   * Найти игру по названию
   */
  async findGameByTitle(title: string): Promise<{ title: string | null; provider: string | null; index: number } | null> {
    this.logStep('Finding game by title', title);
    const games = await this.getAllGames();
    const game = games.find(g => g.title?.toLowerCase().includes(title.toLowerCase()));
    
    if (game) {
      this.logSuccess(`Found game: ${game.title}`);
    } else {
      this.logWarning(`Game not found: ${title}`);
    }
    
    return game || null;
  }

  /**
   * Найти игры по провайдеру
   */
  async findGamesByProvider(provider: string): Promise<Array<{ title: string | null; provider: string | null; index: number }>> {
    this.logStep('Finding games by provider', provider);
    const games = await this.getAllGames();
    const filteredGames = games.filter(g => g.provider?.toLowerCase().includes(provider.toLowerCase()));
    
    this.logSuccess(`Found ${filteredGames.length} games by provider: ${provider}`);
    return filteredGames;
  }

  /**
   * Открыть игру по индексу
   */
  async openGame(index: number): Promise<void> {
    this.logStep('Opening game', index.toString());
    await this.gamesSection.clickGame(index);
    this.logSuccess(`Game ${index} opened`);
  }

  /**
   * Открыть игру по названию
   */
  async openGameByTitle(title: string): Promise<void> {
    this.logStep('Opening game by title', title);
    await this.gamesSection.clickGameByTitle(title);
    this.logSuccess(`Game opened: ${title}`);
  }

  /**
   * Запустить игру по индексу
   */
  async playGame(index: number): Promise<void> {
    this.logStep('Playing game', index.toString());
    await this.gamesSection.playGame(index);
    this.logSuccess(`Game ${index} started`);
  }

  /**
   * Запустить игру по названию
   */
  async playGameByTitle(title: string): Promise<void> {
    this.logStep('Playing game by title', title);
    await this.gamesSection.playGameByTitle(title);
    this.logSuccess(`Game started: ${title}`);
  }

  /**
   * Запустить демо игры по индексу
   */
  async playDemo(index: number): Promise<void> {
    this.logStep('Playing demo', index.toString());
    await this.gamesSection.playDemo(index);
    this.logSuccess(`Demo ${index} started`);
  }

  /**
   * Запустить демо игры по названию
   */
  async playDemoByTitle(title: string): Promise<void> {
    this.logStep('Playing demo by title', title);
    await this.gamesSection.playDemoByTitle(title);
    this.logSuccess(`Demo started: ${title}`);
  }

  /**
   * Добавить игру в избранное по индексу
   */
  async toggleFavorite(index: number): Promise<void> {
    this.logStep('Toggling favorite', index.toString());
    await this.gamesSection.toggleFavorite(index);
    this.logSuccess(`Favorite toggled for game ${index}`);
  }

  /**
   * Открыть случайные игры
   */
  async openRandomGames(count: number = 3): Promise<void> {
    this.logStep('Opening random games', count.toString());
    await this.gamesSection.openRandomGames(count);
    this.logSuccess(`Opened ${count} random games`);
  }

  /**
   * Проверить, загружены ли игры
   */
  async areGamesLoaded(): Promise<boolean> {
    return await this.gamesSection.areGamesLoaded();
  }

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    await this.gamesSection.waitForGamesLoad();
    this.logSuccess('Games loaded');
  }

  /**
   * Получить названия всех игр
   */
  async getAllGameTitles(): Promise<string[]> {
    this.logStep('Getting all game titles');
    const titles = await this.gamesSection.getAllGameTitles();
    this.logSuccess(`Found ${titles.length} game titles`);
    return titles;
  }

  /**
   * Получить всех провайдеров игр
   */
  async getAllGameProviders(): Promise<string[]> {
    this.logStep('Getting all game providers');
    const providers = await this.gamesSection.getAllGameProviders();
    this.logSuccess(`Found ${providers.length} game providers`);
    return providers;
  }
}
