/**
 * Atom Types
 * Типы для атомарных компонентов
 */

import { Page, Locator } from '@playwright/test';
import { IBaseComponent, UIElement } from '../base/base.types';

/**
 * Интерфейс для карточки игры
 */
export interface IGameCard extends IBaseComponent {
  // Локаторы
  title: Locator;
  provider: Locator;
  image: Locator;
  playButton: Locator;
  favoriteButton: Locator;
  demoButton: Locator;

  // Действия
  click(): Promise<void>;
  play(): Promise<void>;
  playDemo(): Promise<void>;
  toggleFavorite(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getTitle(): Promise<string | null>;
  getProvider(): Promise<string | null>;
  getImageSrc(): Promise<string | null>;
  getGameInfo(): Promise<GameCardInfo>;

  // Проверки состояния
  hasPlayButton(): Promise<boolean>;
  hasFavoriteButton(): Promise<boolean>;
  hasDemoButton(): Promise<boolean>;
}

/**
 * Интерфейс для карточки провайдера
 */
export interface IProviderCard extends IBaseComponent {
  // Локаторы
  name: Locator;
  image: Locator;
  gamesCount: Locator;

  // Действия
  click(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getName(): Promise<string | null>;
  getImageSrc(): Promise<string | null>;
  getGamesCount(): Promise<string | null>;
  getProviderInfo(): Promise<ProviderCardInfo>;
}

/**
 * Интерфейс для кнопки фильтра
 */
export interface IFilterButton extends IBaseComponent {
  // Действия
  click(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getText(): Promise<string | null>;
  getAttribute(name: string): Promise<string | null>;

  // Проверки состояния
  isActive(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
}

/**
 * Интерфейс для кнопки пагинации
 */
export interface IPaginationButton extends IBaseComponent {
  // Действия
  click(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getText(): Promise<string | null>;
  getPageNumber(): Promise<number | null>;
  getAttribute(name: string): Promise<string | null>;

  // Проверки состояния
  isActive(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isPrevButton(): Promise<boolean>;
  isNextButton(): Promise<boolean>;
}

/**
 * Интерфейс для поля поиска
 */
export interface ISearchInput extends IBaseComponent {
  // Действия
  fill(text: string): Promise<void>;
  clear(): Promise<void>;
  click(): Promise<void>;
  hover(): Promise<void>;
  pressEnter(): Promise<void>;

  // Получение данных
  getValue(): Promise<string>;
  getPlaceholder(): Promise<string | null>;
  getAttribute(name: string): Promise<string | null>;

  // Проверки состояния
  isFocused(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isEmpty(): Promise<boolean>;
}

/**
 * Интерфейс для баннера
 */
export interface IBanner extends IBaseComponent {
  // Локаторы
  title: Locator;
  subtitle: Locator;
  image: Locator;
  button: Locator;
  overlay: Locator;

  // Действия
  clickButton(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getTitle(): Promise<string | null>;
  getSubtitle(): Promise<string | null>;
  getImageSrc(): Promise<string | null>;
  getButtonText(): Promise<string | null>;
  getBannerInfo(): Promise<BannerInfo>;

  // Проверки состояния
  hasButton(): Promise<boolean>;
  hasImage(): Promise<boolean>;
}

/**
 * Типы данных для атомов
 */
export interface GameCardInfo {
  title: string | null;
  provider: string | null;
  imageSrc: string | null;
}

export interface ProviderCardInfo {
  name: string | null;
  imageSrc: string | null;
  gamesCount: string | null;
}

export interface BannerInfo {
  title: string | null;
  subtitle: string | null;
  imageSrc: string | null;
  buttonText: string | null;
}
