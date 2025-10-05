/**
 * Profile Service
 * Business logic for profile operations
 * 
 * Работает с динамическим контентом профиля через Livewire
 * Обрабатывает POST запросы и обновления данных профиля
 */

import { Page } from '@playwright/test';
import { BaseService } from '@services/base/base.service';
import { IProfileService } from '@types/services/service.types';
import { ProfileComponent } from '@pages/common/profile.component';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

// Livewire types
declare global {
  interface Window {
    Livewire?: {
      find: (id: string) => any;
      emit: (event: string, data?: any) => void;
    };
    livewire?: {
      emitTo: (component: string, event: string, data?: any) => void;
    };
  }
}

export class ProfileService extends BaseService implements IProfileService {
  private profileComponent: ProfileComponent;

  constructor(page: Page) {
    super(page);
    this.profileComponent = new ProfileComponent(page);
  }

  /**
   * Получить полную информацию о профиле
   * Агрегирует данные из разных источников
   */
  async getProfileInfo(): Promise<{
    email: string | null;
    userId: string | null;
    avatarUrl: string | null;
    bonusBalance: string | null;
    bonusProgress: number;
    isLoggedIn: boolean;
    wireId: string | null;
  }> {
    this.logStep('Getting profile information');
    
    const [email, userId, avatarUrl, bonusBalance, bonusProgress, wireId] = await Promise.all([
      this.profileComponent.getUserEmail(),
      this.profileComponent.getUserId(),
      this.profileComponent.getAvatarUrl(),
      this.profileComponent.getBonusAmount(),
      this.profileComponent.getBonusProgress(),
      this.getWireId()
    ]);

    const isLoggedIn = await this.profileComponent.isProfileLoaded();

    return {
      email,
      userId,
      avatarUrl,
      bonusBalance,
      bonusProgress,
      isLoggedIn,
      wireId
    };
  }

  /**
   * Получить Wire ID профиля для Livewire запросов
   */
  async getWireId(): Promise<string | null> {
    try {
      const wireIdElement = this.page.locator('.avatar-user-profile[wire\\:id]');
      const wireId = await wireIdElement.getAttribute('wire:id');
      return wireId;
    } catch {
      return null;
    }
  }

  /**
   * Обновить данные профиля через Livewire
   */
  async updateProfileData(): Promise<void> {
    this.logStep('Updating profile data via Livewire');
    
    const wireId = await this.getWireId();
    if (!wireId) {
      throw new Error('Wire ID not found for profile update');
    }

    // Отправляем Livewire запрос для обновления профиля
    await this.page.evaluate((id) => {
      if (window.Livewire && window.Livewire.find) {
        const component = window.Livewire.find(id);
        if (component) {
          component.call('updateProfileData');
        }
      }
    }, wireId);

    // Ждем обновления DOM
    await this.waitForNetworkIdle();
    await this.profileComponent.waitForLoad();
  }

  /**
   * Обновить прогресс бонуса через Livewire
   */
  async updateBonusProgress(): Promise<void> {
    this.logStep('Updating bonus progress via Livewire');
    
    const wireId = await this.getWireId();
    if (!wireId) {
      throw new Error('Wire ID not found for bonus progress update');
    }

    // Отправляем Livewire запрос для обновления прогресса бонуса
    await this.page.evaluate((id) => {
      if (window.Livewire && window.Livewire.find) {
        const component = window.Livewire.find(id);
        if (component) {
          component.call('updateBonusProgress');
        }
      }
    }, wireId);

    // Ждем обновления DOM
    await this.waitForNetworkIdle();
  }

  /**
   * Переключить язык профиля
   */
  async switchLanguage(language: string): Promise<void> {
    this.logStep(`Switching profile language to: ${language}`);
    
    const wireId = await this.getWireId();
    if (!wireId) {
      throw new Error('Wire ID not found for language switch');
    }

    // Отправляем Livewire запрос для смены языка
    await this.page.evaluate((args: string[]) => {
      const [id, lang] = args;
      if (window.Livewire && window.Livewire.find) {
        const component = window.Livewire.find(id);
        if (component) {
          component.call('setLocale', lang);
        }
      }
    }, [wireId, language]);

    // Ждем обновления DOM
    await this.waitForNetworkIdle();
  }

  /**
   * Показать модальное окно пользователя
   */
  async showUserModal(content: 'overview' | 'statistics' | 'history'): Promise<void> {
    this.logStep(`Showing user modal with content: ${content}`);
    
    // Используем Livewire emit для показа модального окна
    await this.page.evaluate((contentType: string) => {
      if (window.livewire) {
        window.livewire.emitTo('casino.v1.modals.modal-user-info', 'show', { content: contentType });
      }
    }, content);

    // Ждем появления модального окна
    await this.waitForNetworkIdle();
  }

  /**
   * Показать модальное окно кошелька
   */
  async showWalletModal(): Promise<void> {
    this.logStep('Showing wallet modal');
    
    // Используем Livewire emit для показа модального окна кошелька
    await this.page.evaluate(() => {
      if (window.Livewire) {
        window.Livewire.emit("showModalFromRoot", { "target": "modal-wallet-v4" });
      }
    });

    // Ждем появления модального окна
    await this.waitForNetworkIdle();
  }

  /**
   * Показать модальное окно настроек безопасности
   */
  async showSecurityModal(): Promise<void> {
    this.logStep('Showing security modal');
    
    const wireId = await this.getWireId();
    if (!wireId) {
      throw new Error('Wire ID not found for security modal');
    }

    // Отправляем Livewire запрос для показа модального окна безопасности
    await this.page.evaluate((id) => {
      if (window.Livewire && window.Livewire.find) {
        const component = window.Livewire.find(id);
        if (component) {
          component.call('showModal', 'modal-settings-security', '');
        }
      }
    }, wireId);

    // Ждем появления модального окна
    await this.waitForNetworkIdle();
  }

  /**
   * Показать детали пользователя
   */
  async showUserDetails(): Promise<void> {
    this.logStep('Showing user details');
    
    // Используем Livewire emit для показа деталей пользователя
    await this.page.evaluate(() => {
      if (window.livewire) {
        window.livewire.emitTo('casino.v1.modals.modal-settings-details', 'showUserDetails');
      }
    });

    // Ждем появления модального окна
    await this.waitForNetworkIdle();
  }

  /**
   * Проверить, нужно ли обновить данные профиля
   */
  async needsProfileUpdate(): Promise<boolean> {
    this.logStep('Checking if profile needs update');
    
    try {
      // Проверяем, есть ли индикаторы обновления
      const updateIndicators = [
        '.bonus-info[wire\\:poll]',
        '.avatar-user-profile[wire\\:id]'
      ];
      
      for (const selector of updateIndicators) {
        const isVisible = await this.page.locator(selector).isVisible();
        if (isVisible) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Синхронизировать данные профиля с сервером
   */
  async syncProfileData(): Promise<void> {
    this.logStep('Syncing profile data with server');
    
    if (await this.needsProfileUpdate()) {
      await this.updateProfileData();
    }
    
    if (await this.profileComponent.isBonusProgressVisible()) {
      await this.updateBonusProgress();
    }
  }

  /**
   * Получить статус профиля
   */
  async getProfileStatus(): Promise<{
    isLoaded: boolean;
    hasWireId: boolean;
    needsUpdate: boolean;
    bonusProgressVisible: boolean;
  }> {
    this.logStep('Getting profile status');
    
    const [isLoaded, hasWireId, needsUpdate, bonusProgressVisible] = await Promise.all([
      this.profileComponent.isProfileLoaded(),
      this.getWireId().then(id => id !== null),
      this.needsProfileUpdate(),
      this.profileComponent.isBonusProgressVisible()
    ]);

    return {
      isLoaded,
      hasWireId,
      needsUpdate,
      bonusProgressVisible
    };
  }
}
