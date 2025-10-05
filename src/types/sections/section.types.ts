/**
 * Section Types
 * Типы для секционных компонентов
 */

import { Page, Locator } from '@playwright/test';
import { IBaseComponent } from '../base/base.types';
import { IGameCard, IProviderCard, IFilterButton, IPaginationButton, ISearchInput, IBanner } from '../atoms/atom.types';

/**
 * Интерфейс для секции баннера
 */
export interface IBannerSection extends IBaseComponent {
  // Локаторы
  banner: Locator;
  title: Locator;
  subtitle: Locator;
  image: Locator;
  button: Locator;

  // Действия
  getBannerByIndex(index: number): IBanner;
  clickButton(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getTitle(): Promise<string | null>;
  getSubtitle(): Promise<string | null>;
  getImageSrc(): Promise<string | null>;
  getButtonText(): Promise<string | null>;
  getBannersCount(): Promise<number>;
  getBannerInfo(): Promise<BannerSectionInfo>;

  // Проверки состояния
  hasButton(): Promise<boolean>;
  hasImage(): Promise<boolean>;
}

/**
 * Интерфейс для секции игр
 */
export interface IGamesSection extends IBaseComponent {
  // Локаторы
  gamesGrid: Locator;
  gameCard: Locator;
  gameTitle: Locator;
  gameProvider: Locator;
  playButton: Locator;
  favoriteButton: Locator;
  demoButton: Locator;
  loadingSpinner: Locator;
  emptyState: Locator;
  errorState: Locator;

  // Действия
  getGameByIndex(index: number): IGameCard;
  getGameByTitle(title: string): IGameCard;
  clickGame(index: number): Promise<void>;
  clickGameByTitle(title: string): Promise<void>;
  playGame(index: number): Promise<void>;
  playGameByTitle(title: string): Promise<void>;
  toggleFavorite(index: number): Promise<void>;
  playDemo(index: number): Promise<void>;
  openRandomGames(count?: number): Promise<void>;

  // Получение данных
  getGamesCount(): Promise<number>;
  getGameTitle(index: number): Promise<string | null>;
  getGameProvider(index: number): Promise<string | null>;
  getAllGameTitles(): Promise<string[]>;
  getAllGameProviders(): Promise<string[]>;
  getAllGamesInfo(): Promise<GamesSectionInfo[]>;

  // Проверки состояния
  areGamesLoaded(): Promise<boolean>;
  isLoading(): Promise<boolean>;
  isEmpty(): Promise<boolean>;
  hasError(): Promise<boolean>;
  waitForGamesLoad(): Promise<void>;
}

/**
 * Интерфейс для секции фильтров
 */
export interface IFiltersSection extends IBaseComponent {
  // Локаторы
  filterButtons: Locator;
  activeFilter: Locator;
  searchInput: Locator;
  searchButton: Locator;
  dropdown: Locator;

  // Действия
  getFilterButtonByIndex(index: number): IFilterButton;
  getFilterButtonByText(text: string): IFilterButton;
  getSearchInput(): ISearchInput;
  clickFilter(filterText: string): Promise<void>;
  clickFilterByIndex(index: number): Promise<void>;
  search(query: string): Promise<void>;
  clearSearch(): Promise<void>;
  selectDropdownOption(value: string): Promise<void>;

  // Получение данных
  getFiltersCount(): Promise<number>;
  getActiveFilter(): Promise<string | null>;
  getAllFilters(): Promise<string[]>;
  getSearchQuery(): Promise<string>;
  getDropdownOptions(): Promise<string[]>;

  // Проверки состояния
  hasSearchInput(): Promise<boolean>;
  hasDropdown(): Promise<boolean>;
  hasActiveFilter(): Promise<boolean>;
}

/**
 * Интерфейс для секции провайдеров
 */
export interface IProvidersSection extends IBaseComponent {
  // Локаторы
  providersGrid: Locator;
  providerCard: Locator;
  title: Locator;

  // Действия
  getProviderCardByIndex(index: number): IProviderCard;
  getProviderCardByName(name: string): IProviderCard;
  clickProvider(index: number): Promise<void>;
  clickProviderByName(name: string): Promise<void>;
  hoverProvider(index: number): Promise<void>;
  hoverProviderByName(name: string): Promise<void>;

  // Получение данных
  getProvidersCount(): Promise<number>;
  getProviderName(index: number): Promise<string | null>;
  getAllProviderNames(): Promise<string[]>;
  getProviderInfo(index: number): Promise<ProviderSectionInfo>;
  getAllProvidersInfo(): Promise<ProviderSectionInfo[]>;
  getTitle(): Promise<string | null>;

  // Проверки состояния
  areProvidersLoaded(): Promise<boolean>;
}

/**
 * Интерфейс для секции пагинации
 */
export interface IPaginationSection extends IBaseComponent {
  // Локаторы
  paginationButtons: Locator;
  activeButton: Locator;
  prevButton: Locator;
  nextButton: Locator;
  firstButton: Locator;
  lastButton: Locator;

  // Действия
  getPaginationButtonByIndex(index: number): IPaginationButton;
  getPaginationButtonByPage(pageNumber: number): IPaginationButton;
  clickPage(pageNumber: number): Promise<void>;
  clickPrev(): Promise<void>;
  clickNext(): Promise<void>;
  clickFirst(): Promise<void>;
  clickLast(): Promise<void>;

  // Получение данных
  getTotalPages(): Promise<number>;
  getActivePage(): Promise<string | null>;
  getActivePageNumber(): Promise<number | null>;
  getAllPageNumbers(): Promise<number[]>;
  getPaginationInfo(): Promise<PaginationSectionInfo>;

  // Проверки состояния
  hasPagination(): Promise<boolean>;
  isPrevDisabled(): Promise<boolean>;
  isNextDisabled(): Promise<boolean>;
  hasFirstButton(): Promise<boolean>;
  hasLastButton(): Promise<boolean>;
}

/**
 * Типы данных для секций
 */
export interface BannerSectionInfo {
  title: string | null;
  subtitle: string | null;
  imageSrc: string | null;
  buttonText: string | null;
  bannersCount: number;
}

export interface GamesSectionInfo {
  title: string | null;
  provider: string | null;
  index: number;
}

export interface ProviderSectionInfo {
  name: string | null;
  imageSrc: string | null;
  gamesCount: string | null;
  index: number;
}

export interface PaginationSectionInfo {
  totalPages: number;
  activePage: string | null;
  activePageNumber: number | null;
  allPageNumbers: number[];
}
