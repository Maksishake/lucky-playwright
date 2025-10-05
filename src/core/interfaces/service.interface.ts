/**
 * Service Interface
 * Интерфейс для всех сервисов
 */

import { Page } from '@playwright/test';

export interface IService {
  page: Page;
  
  logStep(message: string, details?: string): void;
  logSuccess(message: string): void;
  logError(message: string, error?: Error): void;
  logWarning(message: string): void;
}

export interface INetworkService extends IService {
  waitForNetworkIdle(timeout?: number): Promise<void>;
  waitForToast(type?: 'success' | 'error' | 'any', timeout?: number): Promise<boolean>;
  getToastMessage(type?: 'success' | 'error' | 'any'): Promise<string | null>;
  waitForToastToDisappear(timeout?: number): Promise<void>;
}

export interface ISessionService extends IService {
  checkSessionAlive(): Promise<boolean>;
  isElementVisible(selector: string): Promise<boolean>;
}

export interface IDataService extends IService {
  getData<T>(endpoint: string): Promise<T>;
  postData<T>(endpoint: string, data: any): Promise<T>;
  putData<T>(endpoint: string, data: any): Promise<T>;
  deleteData<T>(endpoint: string): Promise<T>;
}
