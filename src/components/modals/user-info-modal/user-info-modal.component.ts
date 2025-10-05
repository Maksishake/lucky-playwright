/**
 * User Info Modal Component - Modal
 * Модальное окно информации о пользователе
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { BadgeComponent } from '@components/atoms/badge/badge.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { UserProfileCardComponent } from '@components/molecules/user-profile-card/user-profile-card.component';
import { UserStatisticsComponent } from '@components/molecules/user-statistics/user-statistics.component';
import { FavoriteGamesComponent } from '@components/molecules/favorite-games/favorite-games.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class UserInfoModalComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== ЛОКАТОРЫ ==========

  // Заголовок модального окна
  readonly modalTitle: Locator;

  // Кнопка закрытия
  readonly closeButton: IconComponent;

  // Карточка пользователя
  readonly userProfileCard: UserProfileCardComponent;

  // Статистика пользователя
  readonly userStatistics: UserStatisticsComponent;

  // Любимые игры
  readonly favoriteGames: FavoriteGamesComponent;

  constructor(page: Page, root: Locator, componentName: string = 'User Info Modal') {
    super(page, root, componentName);

    // Инициализация основных элементов
    this.modalTitle = root.locator('.modal-title');
    this.closeButton = new IconComponent(
      page,
      root.locator('.modal-close-alpine'),
      'Close Button'
    );

    // Инициализация компонентов
    this.userProfileCard = new UserProfileCardComponent(
      page,
      root.locator('.card-user-profile'),
      'User Profile Card'
    );

    this.userStatistics = new UserStatisticsComponent(
      page,
      root.locator('.modal-body-inner').first(),
      'User Statistics'
    );

    this.favoriteGames = new FavoriteGamesComponent(
      page,
      root.locator('.modal-body-inner').nth(1),
      'Favorite Games'
    );
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость модального окна
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку модального окна
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.isVisible();
      const hasTitle = await this.modalTitle.isVisible();
      const hasProfileCard = await this.userProfileCard.isLoaded();
      const hasStatistics = await this.userStatistics.isLoaded();
      const hasFavoriteGames = await this.favoriteGames.isLoaded();
      
      return isVisible && hasTitle && hasProfileCard && hasStatistics && hasFavoriteGames;
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки модального окна
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.modalTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.userProfileCard.waitForLoad();
    await this.userStatistics.waitForLoad();
    await this.favoriteGames.waitForLoad();
    logger.success('Модальное окно информации о пользователе загружено');
  }

  /**
   * Закрыть модальное окно
   */
  @LogAction('Закрытие модального окна информации о пользователе')
  @ValidateState()
  async close(): Promise<void> {
    await this.closeButton.click();
    await this.root.waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT });
    logger.success('Модальное окно информации о пользователе закрыто');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить заголовок модального окна
   */
  @LogAction('Получение заголовка модального окна')
  @ValidateState()
  async getModalTitle(): Promise<string> {
    try {
      const title = await this.modalTitle.textContent();
      logger.success(`Заголовок модального окна: ${title}`);
      return title || '';
    } catch (error) {
      logger.error('Ошибка получения заголовка модального окна', error as Error);
      return '';
    }
  }

  /**
   * Получить информацию о пользователе
   */
  @LogAction('Получение информации о пользователе')
  @ValidateState()
  async getUserInfo(): Promise<{
    email: string;
    userId: string;
    avatarUrl: string;
    avatarAlt: string;
  }> {
    return await this.userProfileCard.getUserInfo();
  }

  /**
   * Получить статистику пользователя
   */
  @LogAction('Получение статистики пользователя')
  @ValidateState()
  async getStatistics(): Promise<{
    totalWinnings: string;
    totalBets: string;
    totalUsedInBets: string;
  }> {
    return await this.userStatistics.getStatistics();
  }

  /**
   * Получить любимые игры
   */
  @LogAction('Получение любимых игр')
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
    return await this.favoriteGames.getFavoriteGames();
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Скопировать ID пользователя
   */
  @LogAction('Копирование ID пользователя')
  @ValidateState()
  async copyUserId(): Promise<void> {
    await this.userProfileCard.copyUserId();
    logger.success('ID пользователя скопирован');
  }

  /**
   * Переключиться на детали статистики
   */
  @LogAction('Переключение на детали статистики')
  @ValidateState()
  async showStatisticsDetails(): Promise<void> {
    await this.userStatistics.showDetails();
    logger.success('Детали статистики показаны');
  }

  /**
   * Перейти к просмотру всех любимых игр
   */
  @LogAction('Переход к просмотру всех любимых игр')
  @ValidateState()
  async viewAllFavoriteGames(): Promise<void> {
    await this.favoriteGames.viewAllGames();
    logger.success('Переход к просмотру всех любимых игр');
  }

  /**
   * Переключить игру в избранное
   * @param gameTitle Название игры
   */
  @LogAction('Переключение игры в избранное: {gameTitle}')
  @ValidateState()
  async toggleGameFavorite(gameTitle: string): Promise<void> {
    await this.favoriteGames.toggleGameFavorite(gameTitle);
    logger.success(`Игра "${gameTitle}" переключена в избранное`);
  }

  /**
   * Запустить игру в реальном режиме
   * @param gameTitle Название игры
   */
  @LogAction('Запуск игры в реальном режиме: {gameTitle}')
  @ValidateState()
  async playGameReal(gameTitle: string): Promise<void> {
    await this.favoriteGames.playGameReal(gameTitle);
    logger.success(`Игра "${gameTitle}" запущена в реальном режиме`);
  }

  /**
   * Запустить игру в демо режиме
   * @param gameTitle Название игры
   */
  @LogAction('Запуск игры в демо режиме: {gameTitle}')
  @ValidateState()
  async playGameDemo(gameTitle: string): Promise<void> {
    await this.favoriteGames.playGameDemo(gameTitle);
    logger.success(`Игра "${gameTitle}" запущена в демо режиме`);
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что модальное окно полностью загружено
   */
  @LogAction('Проверка полной загрузки модального окна')
  async isModalFullyLoaded(): Promise<boolean> {
    try {
      const isLoaded = await this.isLoaded();
      const hasProfileCard = await this.userProfileCard.isLoaded();
      const hasStatistics = await this.userStatistics.isLoaded();
      const hasFavoriteGames = await this.favoriteGames.isLoaded();
      
      return isLoaded && hasProfileCard && hasStatistics && hasFavoriteGames;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что карточка пользователя загружена
   */
  @LogAction('Проверка загрузки карточки пользователя')
  async isUserProfileLoaded(): Promise<boolean> {
    return await this.userProfileCard.isLoaded();
  }

  /**
   * Проверить, что статистика загружена
   */
  @LogAction('Проверка загрузки статистики')
  async isStatisticsLoaded(): Promise<boolean> {
    return await this.userStatistics.isLoaded();
  }

  /**
   * Проверить, что любимые игры загружены
   */
  @LogAction('Проверка загрузки любимых игр')
  async isFavoriteGamesLoaded(): Promise<boolean> {
    return await this.favoriteGames.isLoaded();
  }

  /**
   * Проверить, что кнопка закрытия активна
   */
  @LogAction('Проверка активности кнопки закрытия')
  async isCloseButtonEnabled(): Promise<boolean> {
    try {
      return await this.closeButton.isEnabled();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ПОЛНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить полную информацию о пользователе
   */
  @LogAction('Получение полной информации о пользователе')
  @ValidateState()
  async getFullUserInfo(): Promise<{
    modalTitle: string;
    userInfo: {
      email: string;
      userId: string;
      avatarUrl: string;
      avatarAlt: string;
    };
    statistics: {
      totalWinnings: string;
      totalBets: string;
      totalUsedInBets: string;
    };
    favoriteGames: {
      games: Array<{
        title: string;
        provider: string;
        imageUrl: string;
        isFavorite: boolean;
      }>;
      hasMoreGames: boolean;
    };
    isFullyLoaded: boolean;
  }> {
    const [modalTitle, userInfo, statistics, favoriteGames, isFullyLoaded] = await Promise.all([
      this.getModalTitle(),
      this.getUserInfo(),
      this.getStatistics(),
      this.getFavoriteGames(),
      this.isModalFullyLoaded()
    ]);

    return {
      modalTitle,
      userInfo,
      statistics,
      favoriteGames,
      isFullyLoaded
    };
  }

  // ========== МЕТОДЫ НАВИГАЦИИ ==========

  /**
   * Перейти к следующей игре в слайдере
   */
  @LogAction('Переход к следующей игре в слайдере')
  @ValidateState()
  async nextGame(): Promise<void> {
    await this.favoriteGames.nextGame();
    logger.success('Переход к следующей игре');
  }

  /**
   * Перейти к предыдущей игре в слайдере
   */
  @LogAction('Переход к предыдущей игре в слайдере')
  @ValidateState()
  async previousGame(): Promise<void> {
    await this.favoriteGames.previousGame();
    logger.success('Переход к предыдущей игре');
  }

  /**
   * Проверить, есть ли следующая игра
   */
  @LogAction('Проверка наличия следующей игры')
  async hasNextGame(): Promise<boolean> {
    return await this.favoriteGames.hasNextGame();
  }

  /**
   * Проверить, есть ли предыдущая игра
   */
  @LogAction('Проверка наличия предыдущей игры')
  async hasPreviousGame(): Promise<boolean> {
    return await this.favoriteGames.hasPreviousGame();
  }
}
