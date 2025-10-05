/**
 * State Types
 * Типы для компонентов состояний
 */

import { Page, Locator } from '@playwright/test';
import { IBaseComponent } from '../base/base.types';

/**
 * Интерфейс для состояния загрузки
 */
export interface ILoadingState extends IBaseComponent {
  // Локаторы
  spinner: Locator;
  overlay: Locator;
  progressBar: Locator;
  loadingText: Locator;

  // Действия
  waitForLoadingComplete(): Promise<void>;
  waitForLoadingStart(): Promise<void>;

  // Получение данных
  getLoadingText(): Promise<string | null>;
  getProgress(): Promise<number | null>;
  getLoadingInfo(): Promise<LoadingStateInfo>;

  // Проверки состояния
  isLoading(): Promise<boolean>;
  hasOverlay(): Promise<boolean>;
  hasSpinner(): Promise<boolean>;
  hasProgressBar(): Promise<boolean>;
  hasLoadingText(): Promise<boolean>;
}

/**
 * Интерфейс для пустого состояния
 */
export interface IEmptyState extends IBaseComponent {
  // Локаторы
  image: Locator;
  title: Locator;
  description: Locator;
  button: Locator;
  icon: Locator;

  // Действия
  clickActionButton(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getTitle(): Promise<string | null>;
  getDescription(): Promise<string | null>;
  getButtonText(): Promise<string | null>;
  getImageSrc(): Promise<string | null>;
  getEmptyStateInfo(): Promise<EmptyStateInfo>;

  // Проверки состояния
  isEmpty(): Promise<boolean>;
  hasImage(): Promise<boolean>;
  hasButton(): Promise<boolean>;
  hasIcon(): Promise<boolean>;
}

/**
 * Интерфейс для состояния ошибки
 */
export interface IErrorState extends IBaseComponent {
  // Локаторы
  title: Locator;
  description: Locator;
  retryButton: Locator;
  closeButton: Locator;
  icon: Locator;
  errorCode: Locator;

  // Действия
  clickRetry(): Promise<void>;
  clickClose(): Promise<void>;
  hover(): Promise<void>;

  // Получение данных
  getTitle(): Promise<string | null>;
  getDescription(): Promise<string | null>;
  getErrorCode(): Promise<string | null>;
  getRetryButtonText(): Promise<string | null>;
  getCloseButtonText(): Promise<string | null>;
  getErrorInfo(): Promise<ErrorStateInfo>;

  // Проверки состояния
  hasError(): Promise<boolean>;
  hasRetryButton(): Promise<boolean>;
  hasCloseButton(): Promise<boolean>;
  hasIcon(): Promise<boolean>;
  hasErrorCode(): Promise<boolean>;
}

/**
 * Типы данных для состояний
 */
export interface LoadingStateInfo {
  text: string | null;
  progress: number | null;
  hasOverlay: boolean;
}

export interface EmptyStateInfo {
  title: string | null;
  description: string | null;
  buttonText: string | null;
  imageSrc: string | null;
}

export interface ErrorStateInfo {
  title: string | null;
  description: string | null;
  errorCode: string | null;
  retryButtonText: string | null;
  closeButtonText: string | null;
}
