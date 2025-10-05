/**
 * Base Types
 * Фундаментальные типы для всей системы
 */

import { Page, Locator } from '@playwright/test';

/**
 * Базовый интерфейс для всех компонентов
 */
export interface IBaseComponent {
  page: Page;
  root: Locator;
  componentName: string;
  isVisible(): Promise<boolean>;
  isLoaded(): Promise<boolean>;
  waitForLoad(): Promise<void>;
}

/**
 * Базовый интерфейс для всех страниц
 */
export interface IBasePage {
  page: Page;
  pageName: string;
  isLoaded(): Promise<boolean>;
  waitForLoad(timeout?: number): Promise<void>;
  navigate(url: string): Promise<void>;
  getTitle(): Promise<string>;
  getURL(): string;
  reload(): Promise<void>;
  screenshot(name?: string): Promise<Buffer>;
}

/**
 * Базовый интерфейс для всех сервисов
 */
export interface IBaseService {
  page: Page;
  logStep(message: string, details?: string): void;
  logSuccess(message: string): void;
  logError(message: string, error?: Error): void;
  logWarning(message: string): void;
  waitForNetworkIdle(timeout?: number): Promise<void>;
  waitForToast(type?: 'success' | 'error' | 'any', timeout?: number): Promise<boolean>;
  getToastMessage(type?: 'success' | 'error' | 'any'): Promise<string | null>;
  waitForToastToDisappear(timeout?: number): Promise<void>;
  checkSessionAlive(): Promise<boolean>;
  isElementVisible(selector: string): Promise<boolean>;
}

/**
 * Общие типы состояний
 */
export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';
export type VisibilityState = 'visible' | 'hidden' | 'loading';
export type InteractionState = 'enabled' | 'disabled' | 'active' | 'inactive';

/**
 * Общие типы для UI элементов
 */
export interface UIElement {
  isVisible: boolean;
  isEnabled: boolean;
  isActive: boolean;
  text?: string;
  value?: string;
  attributes?: Record<string, string>;
}

/**
 * Общие типы для навигации
 */
export interface NavigationInfo {
  currentUrl: string;
  previousUrl?: string;
  canGoBack: boolean;
  canGoForward: boolean;
}

/**
 * Общие типы для ошибок
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
}
