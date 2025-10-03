import { test as baseTest, expect } from '@playwright/test';
import { BusinessFactory } from '../../business/factories/business-factory';
import { Routes } from '../../config/routes';

/**
 * Интерфейс для фикстур Business Commands
 */
export interface BusinessTestFixtures {
  businessFactory: BusinessFactory;
  authCommands: any;
  profileCommands: any;
  walletCommands: any;
  gamesCommands: any;
  navigationCommands: any;
}

/**
 * Базовые фикстуры без авторизации
 */
export const test = baseTest.extend<BusinessTestFixtures>({
  businessFactory: async ({ page }, use) => {
    const businessFactory = new BusinessFactory(page);
    await use(businessFactory);
  },

  authCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createAuthCommands());
  },

  profileCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createProfileCommands());
  },

  walletCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createWalletCommands());
  },

  gamesCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createGamesCommands());
  },

  navigationCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createNavigationCommands());
  }
});

/**
 * Оптимизированные фикстуры с авторизацией
 * Авторизация происходит только один раз для всех команд
 */
export const authenticatedTest = test.extend<BusinessTestFixtures>({
  // Создаем общую авторизацию
  authCommands: async ({ page, businessFactory }, use) => {
    const authCommands = businessFactory.createAuthCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    await authCommands.ensureLoggedIn();
    
    await use(authCommands);
  },
  
  // Остальные команды используют уже авторизованную страницу
  profileCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createProfileCommands());
  },
  
  walletCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createWalletCommands());
  },
  
  gamesCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createGamesCommands());
  },
  
  navigationCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createNavigationCommands());
  }
});

export { expect };

