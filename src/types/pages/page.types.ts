/**
 * Page Types
 * Типы для страниц
 */

import { Page } from '@playwright/test';
import { IBasePage } from '../base/base.types';
import { IBannerSection, IGamesSection, IFiltersSection, IProvidersSection, IPaginationSection } from '../sections/section.types';
import { ILoadingState, IEmptyState, IErrorState } from '../states/state.types';

/**
 * Интерфейс для модальных окон
 */
export interface IModal extends IBasePage {
  open(): Promise<void>;
  close(): Promise<void>;
  isOpen(): Promise<boolean>;
  waitForOpen(timeout?: number): Promise<void>;
  waitForClose(timeout?: number): Promise<void>;
}

/**
 * Интерфейс для универсальной страницы категории
 */
export interface ICategoryPage extends IBasePage {
  // Компоненты секций
  bannerSection: IBannerSection;
  gamesSection: IGamesSection;
  filtersSection: IFiltersSection;
  providersSection: IProvidersSection;
  paginationSection: IPaginationSection;

  // Компоненты состояний
  loadingState: ILoadingState;
  emptyState: IEmptyState;
  errorState: IErrorState;

  // Проверки состояния
  areGamesLoaded(): Promise<boolean>;
  isLoading(): Promise<boolean>;
  isEmpty(): Promise<boolean>;
  hasError(): Promise<boolean>;
  hasPagination(): Promise<boolean>;

  // Ожидание загрузки
  waitForGamesLoad(): Promise<void>;
  waitForLoadingComplete(): Promise<void>;
}

/**
 * Интерфейс для страницы авторизации
 */
export interface IAuthPage extends IBasePage {
  // Локаторы
  emailInput: any;
  passwordInput: any;
  loginButton: any;
  registerButton: any;
  errorMessage: any;

  // Действия
  fillEmail(email: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLogin(): Promise<void>;
  clickRegister(): Promise<void>;
  loginWithEmail(email: string, password: string): Promise<void>;
  loginWithPhone(phone: string, password: string): Promise<void>;

  // Проверки состояния
  hasLoginError(): Promise<boolean>;
  getLoginError(): Promise<string>;
  isLoggedIn(): Promise<boolean>;
}

/**
 * Интерфейс для страницы кошелька
 */
export interface IWalletPage extends IBasePage {
  // Локаторы
  balance: any;
  depositButton: any;
  withdrawButton: any;
  transactionHistory: any;

  // Действия
  getBalance(): Promise<number>;
  clickDeposit(): Promise<void>;
  clickWithdraw(): Promise<void>;
  deposit(amount: number): Promise<void>;
  withdraw(amount: number): Promise<void>;

  // Получение данных
  getTransactionHistory(): Promise<any[]>;
}

/**
 * Типы данных для страниц
 */
export interface PageState {
  isLoaded: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  hasError: boolean;
  hasPagination: boolean;
}

export interface CategoryPageInfo {
  gamesCount: number;
  hasPagination: boolean;
  activePage: number | null;
  totalPages: number;
  filters: string[];
  providers: string[];
}
