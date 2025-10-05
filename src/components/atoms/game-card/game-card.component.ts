/**
 * Game Card Component - Atom
 * Компонент карточки игры
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { IInteractiveComponent, ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { IconComponent } from '@components/atoms/icon/icon.component';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class GameCardComponent extends BaseComponent implements IInteractiveComponent, ITextComponent {
  // ========== АБСТРАКТНЫЕ МЕТОДЫ ==========

  /**
   * Проверить загрузку компонента
   */
  async isLoaded(): Promise<boolean> {
    try {
      const isVisible = await this.root.isVisible();
      const hasImage = await this.gameImage.isVisible();
      const hasTitle = await this.gameTitle.isVisible();
      const hasProvider = await this.gameProvider.isVisible();
      
      return isVisible && hasImage && hasTitle && hasProvider;
    } catch {
      return false;
    }
  }
  // ========== ЛОКАТОРЫ ==========

  // Изображение игры
  readonly gameImage: Locator;

  // Заголовок игры
  readonly gameTitle: Locator;

  // Провайдер игры
  readonly gameProvider: Locator;

  // Кнопка избранного
  readonly favoriteButton: ButtonComponent;

  // Кнопки запуска игры
  readonly realButton: ButtonComponent;
  readonly demoButton: ButtonComponent;

  // Блок кнопок
  readonly buttonsBlock: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Game Card') {
    super(page, root, componentName);

    // Инициализация элементов
    this.gameImage = root.locator('.img');
    this.gameTitle = root.locator('.title');
    this.gameProvider = root.locator('.subtitle');
    this.favoriteButton = new ButtonComponent(
      page,
      root.locator('button[wire:click="toggleFavorite"]'),
      'Favorite Button'
    );
    this.realButton = new ButtonComponent(
      page,
      root.locator('button[wire:click="startGame(\'real\')"]'),
      'Real Button'
    );
    this.demoButton = new ButtonComponent(
      page,
      root.locator('button[wire:click="startGame(\'demo\')"]'),
      'Demo Button'
    );
    this.buttonsBlock = root.locator('.buttons');
  }

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

  /**
   * Дождаться загрузки карточки игры
   */
  @LogAction('Ожидание загрузки карточки игры')
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.gameImage.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.gameTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.gameProvider.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Карточка игры загружена');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить заголовок игры
   */
  @LogAction('Получение заголовка игры')
  @ValidateState()
  async getTitle(): Promise<string> {
    try {
      const title = await this.gameTitle.textContent();
      logger.success(`Заголовок игры: ${title}`);
      return title?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения заголовка игры', error as Error);
      return '';
    }
  }

  /**
   * Получить провайдера игры
   */
  @LogAction('Получение провайдера игры')
  @ValidateState()
  async getProvider(): Promise<string> {
    try {
      const provider = await this.gameProvider.textContent();
      logger.success(`Провайдер игры: ${provider}`);
      return provider?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения провайдера игры', error as Error);
      return '';
    }
  }

  /**
   * Получить URL изображения игры
   */
  @LogAction('Получение URL изображения игры')
  @ValidateState()
  async getImageUrl(): Promise<string> {
    try {
      const imageUrl = await this.gameImage.getAttribute('src');
      logger.success(`URL изображения игры: ${imageUrl}`);
      return imageUrl || '';
    } catch (error) {
      logger.error('Ошибка получения URL изображения игры', error as Error);
      return '';
    }
  }

  /**
   * Получить alt текст изображения игры
   */
  @LogAction('Получение alt текста изображения игры')
  @ValidateState()
  async getImageAlt(): Promise<string> {
    try {
      const altText = await this.gameImage.getAttribute('alt');
      logger.success(`Alt текст изображения игры: ${altText}`);
      return altText || '';
    } catch (error) {
      logger.error('Ошибка получения alt текста изображения игры', error as Error);
      return '';
    }
  }

  /**
   * Получить полную информацию об игре
   */
  @LogAction('Получение полной информации об игре')
  @ValidateState()
  async getGameInfo(): Promise<{
    title: string;
    provider: string;
    imageUrl: string;
    imageAlt: string;
    isFavorite: boolean;
  }> {
    const [title, provider, imageUrl, imageAlt, isFavorite] = await Promise.all([
      this.getTitle(),
      this.getProvider(),
      this.getImageUrl(),
      this.getImageAlt(),
      this.isFavorite()
    ]);

    return {
      title,
      provider,
      imageUrl,
      imageAlt,
      isFavorite
    };
  }

  // ========== МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ==========

  /**
   * Переключить игру в избранное
   */
  @LogAction('Переключение игры в избранное')
  @ValidateState()
  async toggleFavorite(): Promise<void> {
    try {
      await this.favoriteButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success('Игра переключена в избранное');
    } catch (error) {
      logger.error('Ошибка переключения игры в избранное', error as Error);
      throw error;
    }
  }

  /**
   * Запустить игру в реальном режиме
   */
  @LogAction('Запуск игры в реальном режиме')
  @ValidateState()
  async playReal(): Promise<void> {
    try {
      await this.realButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success('Игра запущена в реальном режиме');
    } catch (error) {
      logger.error('Ошибка запуска игры в реальном режиме', error as Error);
      throw error;
    }
  }

  /**
   * Запустить игру в демо режиме
   */
  @LogAction('Запуск игры в демо режиме')
  @ValidateState()
  async playDemo(): Promise<void> {
    try {
      await this.demoButton.click();
      await this.page.waitForLoadState('networkidle');
      logger.success('Игра запущена в демо режиме');
    } catch (error) {
      logger.error('Ошибка запуска игры в демо режиме', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по изображению игры
   */
  @LogAction('Клик по изображению игры')
  @ValidateState()
  async clickImage(): Promise<void> {
    try {
      await this.gameImage.click();
      logger.success('Клик по изображению игры выполнен');
    } catch (error) {
      logger.error('Ошибка клика по изображению игры', error as Error);
      throw error;
    }
  }

  /**
   * Кликнуть по заголовку игры
   */
  @LogAction('Клик по заголовку игры')
  @ValidateState()
  async clickTitle(): Promise<void> {
    try {
      await this.gameTitle.click();
      logger.success('Клик по заголовку игры выполнен');
    } catch (error) {
      logger.error('Ошибка клика по заголовку игры', error as Error);
      throw error;
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что игра в избранном
   */
  @LogAction('Проверка, что игра в избранном')
  async isFavorite(): Promise<boolean> {
    try {
      const favoriteIcon = this.favoriteButton.root.locator('.icon svg');
      const isVisible = await favoriteIcon.isVisible();
      logger.success(`Игра в избранном: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error('Ошибка проверки, что игра в избранном', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что кнопка избранного активна
   */
  @LogAction('Проверка активности кнопки избранного')
  async isFavoriteButtonEnabled(): Promise<boolean> {
    try {
      return await this.favoriteButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка реальной игры активна
   */
  @LogAction('Проверка активности кнопки реальной игры')
  async isRealButtonEnabled(): Promise<boolean> {
    try {
      return await this.realButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что кнопка демо игры активна
   */
  @LogAction('Проверка активности кнопки демо игры')
  async isDemoButtonEnabled(): Promise<boolean> {
    try {
      return await this.demoButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что изображение игры загружено
   */
  @LogAction('Проверка загрузки изображения игры')
  async isImageLoaded(): Promise<boolean> {
    try {
      return await this.gameImage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что заголовок игры отображается
   */
  @LogAction('Проверка отображения заголовка игры')
  async isTitleVisible(): Promise<boolean> {
    try {
      return await this.gameTitle.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что провайдер игры отображается
   */
  @LogAction('Проверка отображения провайдера игры')
  async isProviderVisible(): Promise<boolean> {
    try {
      return await this.gameProvider.isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что все элементы карточки игры загружены
   */
  @LogAction('Проверка загрузки всех элементов карточки игры')
  async areAllElementsLoaded(): Promise<boolean> {
    try {
      const [isImageLoaded, isTitleVisible, isProviderVisible, isFavoriteButtonEnabled, isRealButtonEnabled, isDemoButtonEnabled] = await Promise.all([
        this.isImageLoaded(),
        this.isTitleVisible(),
        this.isProviderVisible(),
        this.isFavoriteButtonEnabled(),
        this.isRealButtonEnabled(),
        this.isDemoButtonEnabled()
      ]);

      const allLoaded = isImageLoaded && isTitleVisible && isProviderVisible && isFavoriteButtonEnabled && isRealButtonEnabled && isDemoButtonEnabled;
      logger.success(`Все элементы карточки игры загружены: ${allLoaded}`);
      return allLoaded;
    } catch (error) {
      logger.error('Ошибка проверки загрузки всех элементов карточки игры', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что игра готова к запуску
   */
  @LogAction('Проверка готовности игры к запуску')
  async isGameReadyToPlay(): Promise<boolean> {
    try {
      const [isRealButtonEnabled, isDemoButtonEnabled] = await Promise.all([
        this.isRealButtonEnabled(),
        this.isDemoButtonEnabled()
      ]);

      const isReady = isRealButtonEnabled || isDemoButtonEnabled;
      logger.success(`Игра готова к запуску: ${isReady}`);
      return isReady;
    } catch (error) {
      logger.error('Ошибка проверки готовности игры к запуску', error as Error);
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить размер изображения игры
   */
  @LogAction('Получение размера изображения игры')
  @ValidateState()
  async getImageSize(): Promise<{ width: number; height: number }> {
    try {
      const boundingBox = await this.gameImage.boundingBox();
      if (boundingBox) {
        logger.success(`Размер изображения игры: ${boundingBox.width}x${boundingBox.height}`);
        return {
          width: boundingBox.width,
          height: boundingBox.height
        };
      }
      return { width: 0, height: 0 };
    } catch (error) {
      logger.error('Ошибка получения размера изображения игры', error as Error);
      return { width: 0, height: 0 };
    }
  }

  /**
   * Получить стили карточки игры
   */
  @LogAction('Получение стилей карточки игры')
  @ValidateState()
  async getCardStyles(): Promise<{
    backgroundColor: string;
    borderRadius: string;
    boxShadow: string;
  }> {
    try {
      const styles = await this.root.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return {
          backgroundColor: computedStyle.backgroundColor,
          borderRadius: computedStyle.borderRadius,
          boxShadow: computedStyle.boxShadow
        };
      });
      logger.success('Стили карточки игры получены');
      return styles;
    } catch (error) {
      logger.error('Ошибка получения стилей карточки игры', error as Error);
      return {
        backgroundColor: '',
        borderRadius: '',
        boxShadow: ''
      };
    }
  }
}