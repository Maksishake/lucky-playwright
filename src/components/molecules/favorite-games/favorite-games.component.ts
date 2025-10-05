/**
 * Favorite Games Component - Molecule
 * Компонент любимых игр с слайдером
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { GameCardComponent } from '@components/atoms/game-card/game-card.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class FavoriteGamesComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость компонента
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  // ========== ЛОКАТОРЫ ==========

  // Заголовок секции любимых игр
  readonly favoriteGamesTitle: Locator;

  // Иконка любимых игр
  readonly favoriteGamesIcon: IconComponent;

  // Кнопка "Переглянути всі"
  readonly viewAllButton: ButtonComponent;

  // Слайдер любимых игр
  readonly gamesSlider: Locator;

  // Кнопки навигации слайдера
  readonly prevButton: ButtonComponent;
  readonly nextButton: ButtonComponent;

  // Трек слайдера
  readonly sliderTrack: Locator;

  // Список игр
  readonly gamesList: Locator;

  // Карточки игр
  readonly gameCards: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Favorite Games') {
    super(page, root, componentName);

    // Инициализация основных элементов
    this.favoriteGamesTitle = root.locator('.text-white:has-text("Улюблені ігри")');
    this.favoriteGamesIcon = new IconComponent(
      page,
      root.locator('.icon-lg'),
      'Favorite Games Icon'
    );
    this.viewAllButton = new ButtonComponent(
      page,
      root.locator('.btn.btn-link'),
      'View All Button'
    );

    // Инициализация слайдера
    this.gamesSlider = root.locator('.splide');
    this.prevButton = new ButtonComponent(
      page,
      this.gamesSlider.locator('.splide__arrow--prev'),
      'Previous Button'
    );
    this.nextButton = new ButtonComponent(
      page,
      this.gamesSlider.locator('.splide__arrow--next'),
      'Next Button'
    );
    this.sliderTrack = this.gamesSlider.locator('.splide__track');
    this.gamesList = this.sliderTrack.locator('.splide__list');
    this.gameCards = this.gamesList.locator('.splide__slide');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить загрузку компонента любимых игр
   */
  @LogAction('Проверка загрузки компонента любимых игр')
  @ValidateState()
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.root.isVisible();
      const hasTitle = await this.favoriteGamesTitle.isVisible();
      const hasIcon = await this.favoriteGamesIcon.isLoaded();
      const hasButton = await this.viewAllButton.isLoaded();
      const hasSlider = await this.gamesSlider.isVisible();
      
      return isVisible && hasTitle && hasIcon && hasButton && hasSlider;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки компонента любимых игр
   */
  @LogAction('Ожидание загрузки компонента любимых игр')
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.favoriteGamesTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.favoriteGamesIcon.waitForLoad();
    await this.viewAllButton.waitForLoad();
    await this.gamesSlider.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент любимых игр загружен');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить заголовок секции любимых игр
   */
  @LogAction('Получение заголовка секции любимых игр')
  @ValidateState()
  async getFavoriteGamesTitle(): Promise<string> {
    try {
      const title = await this.favoriteGamesTitle.textContent();
      logger.success(`Заголовок любимых игр: ${title}`);
      return title?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения заголовка любимых игр', error as Error);
      return '';
    }
  }

  /**
   * Получить количество игр в слайдере
   */
  @LogAction('Получение количества игр в слайдере')
  @ValidateState()
  async getGamesCount(): Promise<number> {
    try {
      const count = await this.gameCards.count();
      logger.success(`Количество игр в слайдере: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества игр в слайдере', error as Error);
      return 0;
    }
  }

  /**
   * Получить информацию о всех играх
   */
  @LogAction('Получение информации о всех играх')
  @ValidateState()
  async getFavoriteGames(): Promise<{
    games: Array<{
      title: string;
      provider: string;
      imageUrl: string;
      isFavorite: boolean;
    }>;
    hasMoreGames: boolean;
  }> {
    try {
      const games = await this.gameCards.all();
      const gamesInfo = [];

      for (const game of games) {
        const gameCard = new GameCardComponent(page, game, 'Game Card');
        const title = await gameCard.getTitle();
        const provider = await gameCard.getProvider();
        const imageUrl = await gameCard.getImageUrl();
        const isFavorite = await gameCard.isFavorite();

        gamesInfo.push({
          title,
          provider,
          imageUrl,
          isFavorite
        });
      }

      const hasMoreGames = await this.viewAllButton.isEnabled();

      logger.success(`Получена информация о ${gamesInfo.length} играх`);
      return {
        games: gamesInfo,
        hasMoreGames
      };
    } catch (error) {
      logger.error('Ошибка получения информации о играх', error as Error);
      return {
        games: [],
        hasMoreGames: false
      };
    }
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Перейти к просмотру всех любимых игр
   */
  @LogAction('Переход к просмотру всех любимых игр')
  @ValidateState()
  async viewAllGames(): Promise<void> {
    try {
      await this.viewAllButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success('Переход к просмотру всех любимых игр выполнен');
    } catch (error) {
      logger.error('Ошибка перехода к просмотру всех любимых игр', error as Error);
      throw error;
    }
  }

  /**
   * Перейти к следующей игре в слайдере
   */
  @LogAction('Переход к следующей игре в слайдере')
  @ValidateState()
  async nextGame(): Promise<void> {
    try {
      await this.nextButton.click();
      await this.page.waitForTimeout(500); // Небольшая задержка для анимации
      logger.success('Переход к следующей игре выполнен');
    } catch (error) {
      logger.error('Ошибка перехода к следующей игре', error as Error);
      throw error;
    }
  }

  /**
   * Перейти к предыдущей игре в слайдере
   */
  @LogAction('Переход к предыдущей игре в слайдере')
  @ValidateState()
  async previousGame(): Promise<void> {
    try {
      await this.prevButton.click();
      await this.page.waitForTimeout(500); // Небольшая задержка для анимации
      logger.success('Переход к предыдущей игре выполнен');
    } catch (error) {
      logger.error('Ошибка перехода к предыдущей игре', error as Error);
      throw error;
    }
  }

  /**
   * Переключить игру в избранное
   * @param gameTitle Название игры
   */
  @LogAction('Переключение игры в избранное: {gameTitle}')
  @ValidateState()
  async toggleGameFavorite(gameTitle: string): Promise<void> {
    try {
      const gameCard = this.gameCards.filter({ hasText: gameTitle }).first();
      const favoriteButton = gameCard.locator('button[wire:click="toggleFavorite"]');
      await favoriteButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success(`Игра "${gameTitle}" переключена в избранное`);
    } catch (error) {
      logger.error(`Ошибка переключения игры "${gameTitle}" в избранное`, error as Error);
      throw error;
    }
  }

  /**
   * Запустить игру в реальном режиме
   * @param gameTitle Название игры
   */
  @LogAction('Запуск игры в реальном режиме: {gameTitle}')
  @ValidateState()
  async playGameReal(gameTitle: string): Promise<void> {
    try {
      const gameCard = this.gameCards.filter({ hasText: gameTitle }).first();
      const realButton = gameCard.locator('button[wire:click="startGame(\'real\')"]');
      await realButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success(`Игра "${gameTitle}" запущена в реальном режиме`);
    } catch (error) {
      logger.error(`Ошибка запуска игры "${gameTitle}" в реальном режиме`, error as Error);
      throw error;
    }
  }

  /**
   * Запустить игру в демо режиме
   * @param gameTitle Название игры
   */
  @LogAction('Запуск игры в демо режиме: {gameTitle}')
  @ValidateState()
  async playGameDemo(gameTitle: string): Promise<void> {
    try {
      const gameCard = this.gameCards.filter({ hasText: gameTitle }).first();
      const demoButton = gameCard.locator('button[wire:click="startGame(\'demo\')"]');
      await demoButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success(`Игра "${gameTitle}" запущена в демо режиме`);
    } catch (error) {
      logger.error(`Ошибка запуска игры "${gameTitle}" в демо режиме`, error as Error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что заголовок любимых игр отображается
   */
  @LogAction('Проверка отображения заголовка любимых игр')
  async isFavoriteGamesTitleVisible(): Promise<boolean> {
    try {
      return await this.favoriteGamesTitle.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка "Переглянути всі" активна
   */
  @LogAction('Проверка активности кнопки "Переглянути всі"')
  async isViewAllButtonEnabled(): Promise<boolean> {
    try {
      return await this.viewAllButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что слайдер отображается
   */
  @LogAction('Проверка отображения слайдера')
  async isSliderVisible(): Promise<boolean> {
    try {
      return await this.gamesSlider.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка "Следующая" активна
   */
  @LogAction('Проверка активности кнопки "Следующая"')
  async isNextButtonEnabled(): Promise<boolean> {
    try {
      return await this.nextButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка "Предыдущая" активна
   */
  @LogAction('Проверка активности кнопки "Предыдущая"')
  async isPrevButtonEnabled(): Promise<boolean> {
    try {
      return await this.prevButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, есть ли следующая игра
   */
  @LogAction('Проверка наличия следующей игры')
  async hasNextGame(): Promise<boolean> {
    try {
      return await this.isNextButtonEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, есть ли предыдущая игра
   */
  @LogAction('Проверка наличия предыдущей игры')
  async hasPreviousGame(): Promise<boolean> {
    try {
      return await this.isPrevButtonEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что в слайдере есть игры
   */
  @LogAction('Проверка наличия игр в слайдере')
  async hasGames(): Promise<boolean> {
    try {
      const count = await this.getGamesCount();
      const hasGames = count > 0;
      logger.success(`В слайдере есть игры: ${hasGames}`);
      return hasGames;
    } catch (error) {
      logger.error('Ошибка проверки наличия игр в слайдере', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что все игры загружены корректно
   */
  @LogAction('Проверка корректности загрузки игр')
  async areGamesLoadedCorrectly(): Promise<boolean> {
    try {
      const games = await this.gameCards.all();
      let allLoaded = true;

      for (const game of games) {
        const gameCard = new GameCardComponent(page, game, 'Game Card');
        const isLoaded = await gameCard.isLoaded();
        if (!isLoaded) {
          allLoaded = false;
          break;
        }
      }

      logger.success(`Все игры загружены корректно: ${allLoaded}`);
      return allLoaded;
    } catch (error) {
      logger.error('Ошибка проверки корректности загрузки игр', error as Error);
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить информацию о текущей активной игре
   */
  @LogAction('Получение информации о текущей активной игре')
  @ValidateState()
  async getCurrentActiveGame(): Promise<{
    title: string;
    provider: string;
    imageUrl: string;
    isFavorite: boolean;
  } | null> {
    try {
      const activeGame = this.gameCards.filter({ hasText: 'is-active' }).first();
      if (await activeGame.isVisible()) {
        const gameCard = new GameCardComponent(page, activeGame, 'Active Game Card');
        const title = await gameCard.getTitle();
        const provider = await gameCard.getProvider();
        const imageUrl = await gameCard.getImageUrl();
        const isFavorite = await gameCard.isFavorite();

        logger.success(`Текущая активная игра: ${title}`);
        return {
          title,
          provider,
          imageUrl,
          isFavorite
        };
      }
      return null;
    } catch (error) {
      logger.error('Ошибка получения информации о текущей активной игре', error as Error);
      return null;
    }
  }

  /**
   * Получить позицию слайдера
   */
  @LogAction('Получение позиции слайдера')
  @ValidateState()
  async getSliderPosition(): Promise<number> {
    try {
      const transform = await this.gamesList.getAttribute('style');
      const match = transform?.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
      if (match) {
        const position = parseFloat(match[1]);
        logger.success(`Позиция слайдера: ${position}px`);
        return position;
      }
      return 0;
    } catch (error) {
      logger.error('Ошибка получения позиции слайдера', error as Error);
      return 0;
    }
  }
}
