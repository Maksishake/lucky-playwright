/**
 * Service Types
 * Типы для бизнес-сервисов
 */

import { Page } from '@playwright/test';
import { IBaseService } from '../base/base.types';
import { User } from '../models/user';
import { Game, GameResult } from '../models/game';
import { Transaction } from '../models/transaction';

/**
 * Интерфейс для сервиса авторизации
 */
export interface IAuthService extends IBaseService {
  loginWithEmail(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  fillCredentials(email: string, password: string): Promise<void>;
  loginWithPhone(phone: string, password: string): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  register(user: User): Promise<void>;
  getCurrentUserEmail(): Promise<string | null>;
  hasLoginError(): Promise<boolean>;
  getLoginError(): Promise<string>;
}

/**
 * Интерфейс для сервиса кошелька
 */
export interface IWalletService extends IBaseService {
  getBalance(): Promise<number>;
  deposit(amount: number): Promise<void>;
  withdraw(amount: number): Promise<void>;
  openWallet(): Promise<void>;
  getTransactionHistory(): Promise<Transaction[]>;
}

/**
 * Интерфейс для сервиса профиля
 */
export interface IProfileService extends IBaseService {
  getProfileInfo(): Promise<ProfileInfo>;
  getWireId(): Promise<string | null>;
  updateProfileData(): Promise<void>;
  updateBonusProgress(): Promise<void>;
  switchLanguage(language: string): Promise<void>;
  showUserModal(content: 'overview' | 'statistics' | 'history'): Promise<void>;
  showWalletModal(): Promise<void>;
  showSecurityModal(): Promise<void>;
  showUserDetails(): Promise<void>;
  needsProfileUpdate(): Promise<boolean>;
  syncProfileData(): Promise<void>;
  getProfileStatus(): Promise<ProfileStatus>;
}

/**
 * Интерфейс для сервиса игр
 */
export interface IGamesService extends IBaseService {
  getAllGames(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
  findGameByTitle(title: string): Promise<GameInfo | null>;
  findGamesByProvider(provider: string): Promise<GameInfo[]>;
  openGame(index: number): Promise<void>;
  openGameByTitle(title: string): Promise<void>;
  playGame(index: number): Promise<void>;
  playGameByTitle(title: string): Promise<void>;
  playDemo(index: number): Promise<void>;
  playDemoByTitle(title: string): Promise<void>;
  toggleFavorite(index: number): Promise<void>;
  openRandomGames(count?: number): Promise<void>;
  areGamesLoaded(): Promise<boolean>;
  waitForGamesLoad(): Promise<void>;
  getAllGameTitles(): Promise<string[]>;
  getAllGameProviders(): Promise<string[]>;
}

/**
 * Интерфейс для сервиса фильтров
 */
export interface IFiltersService extends IBaseService {
  search(query: string): Promise<void>;
  clearSearch(): Promise<void>;
  getSearchQuery(): Promise<string>;
  clickFilter(filterName: string): Promise<void>;
  clickFilterByIndex(index: number): Promise<void>;
  getActiveFilter(): Promise<string | null>;
  getAllFilters(): Promise<string[]>;
  selectDropdownOption(option: string): Promise<void>;
  getDropdownOptions(): Promise<string[]>;
  hasSearchInput(): Promise<boolean>;
  hasDropdown(): Promise<boolean>;
  hasActiveFilter(): Promise<boolean>;
  getFiltersCount(): Promise<number>;
  isVisible(): Promise<boolean>;
  waitForLoad(): Promise<void>;
}

/**
 * Интерфейс для сервиса пагинации
 */
export interface IPaginationService extends IBaseService {
  goToNextPage(): Promise<void>;
  goToPrevPage(): Promise<void>;
  goToFirstPage(): Promise<void>;
  goToLastPage(): Promise<void>;
  goToPage(pageNumber: number): Promise<void>;
  getPaginationInfo(): Promise<PaginationInfo>;
  getTotalPages(): Promise<number>;
  getActivePage(): Promise<string | null>;
  getActivePageNumber(): Promise<number | null>;
  getAllPageNumbers(): Promise<number[]>;
  hasPagination(): Promise<boolean>;
  isPrevDisabled(): Promise<boolean>;
  isNextDisabled(): Promise<boolean>;
  hasFirstButton(): Promise<boolean>;
  hasLastButton(): Promise<boolean>;
  isVisible(): Promise<boolean>;
  waitForLoad(): Promise<void>;
}

/**
 * Интерфейс для сервиса страницы категории
 */
export interface ICategoryPageService extends IBaseService {
  loadCategoryPage(categoryName?: string): Promise<void>;
  areGamesLoaded(): Promise<boolean>;
  getGamesCount(): Promise<number>;
  getGamesInfo(): Promise<GameInfo[]>;
  openRandomGames(count?: number): Promise<void>;
  searchGames(query: string): Promise<void>;
  filterByProvider(providerName: string): Promise<void>;
  filterByCategory(categoryName: string): Promise<void>;
  goToNextPage(): Promise<void>;
  goToPrevPage(): Promise<void>;
  goToPage(pageNumber: number): Promise<void>;
  getPaginationInfo(): Promise<PaginationInfo>;
  getPageState(): Promise<PageState>;
  waitForGamesLoad(): Promise<void>;
  waitForLoadingComplete(): Promise<void>;
}

/**
 * Типы данных для сервисов
 */
export interface ProfileInfo {
  email: string | null;
  userId: string | null;
  avatarUrl: string | null;
  bonusBalance: string | null;
  bonusProgress: number;
  isLoggedIn: boolean;
  wireId: string | null;
}

export interface ProfileStatus {
  isLoaded: boolean;
  hasWireId: boolean;
  needsUpdate: boolean;
  bonusProgressVisible: boolean;
}

export interface GameInfo {
  title: string | null;
  provider: string | null;
  index: number;
}

export interface PaginationInfo {
  totalPages: number;
  activePage: string | null;
  activePageNumber: number | null;
  allPageNumbers: number[];
}

export interface PageState {
  isLoaded: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  hasError: boolean;
  hasPagination: boolean;
}
