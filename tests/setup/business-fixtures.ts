import { test as base, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { BusinessFactory } from '../../business/factories/business-factory';
import { PageFactory } from '../../business/factories/page-factory';
import { ModalFactory } from '../../business/factories/modal-factory';

// Business Commands
import { AuthCommands } from '../../business/auth/auth.commands';
import { RegistrationCommands } from '../../business/auth/registration.commands';
import { WalletCommands } from '../../business/wallet/wallet.commands';
import { ProfileCommands } from '../../business/profile/profile.commands';
import { GamesCommands } from '../../business/games/games.commands';
import { NavigationCommands } from '../../business/navigation/navigation.commands';

import { Routes } from '../../config/routes';

/**
  Разделение UI-слоя и бизнес-логики
 */

type BusinessTestFixtures = {
  businessFactory: BusinessFactory;
  pageFactory: PageFactory;
  modalFactory: ModalFactory;
  authCommands: AuthCommands;
  registrationCommands: RegistrationCommands;
  walletCommands: WalletCommands;
  profileCommands: ProfileCommands;
  gamesCommands: GamesCommands;
  navigationCommands: NavigationCommands;
};

/**
 * Базовые фикстуры (без автоматической авторизации)
 */
export const test = base.extend<BusinessTestFixtures>({
  businessFactory: async ({ page }, use) => {
    const factory = new BusinessFactory(page);
    await use(factory);
  },

  pageFactory: async ({ businessFactory }, use) => {
    await use(businessFactory.getPageFactory());
  },

  modalFactory: async ({ businessFactory }, use) => {
    await use(businessFactory.getModalFactory());
  },

  authCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createAuthCommands());
  },

  registrationCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createRegistrationCommands());
  },

  walletCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createWalletCommands());
  },

  profileCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createProfileCommands());
  },

  gamesCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createGamesCommands());
  },

  navigationCommands: async ({ businessFactory }, use) => {
    await use(businessFactory.createNavigationCommands());
  }
});

/**
 * Фикстуры с автоматической авторизацией
 * Пользователь автоматически залогинен перед каждым тестом
 */
export const authenticatedTest = test.extend<BusinessTestFixtures>({
  // Переопределяем все команды с автоматической авторизацией
  authCommands: async ({ page, businessFactory }, use) => {
    const authCommands = businessFactory.createAuthCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    await authCommands.ensureLoggedIn();
    
    await use(authCommands);
  },
  
  profileCommands: async ({ page, businessFactory }, use) => {
    const profileCommands = businessFactory.createProfileCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    const authCommands = businessFactory.createAuthCommands();
    await authCommands.ensureLoggedIn();
    
    await use(profileCommands);
  },
  
  walletCommands: async ({ page, businessFactory }, use) => {
    const walletCommands = businessFactory.createWalletCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    const authCommands = businessFactory.createAuthCommands();
    await authCommands.ensureLoggedIn();
    
    await use(walletCommands);
  },
  
  gamesCommands: async ({ page, businessFactory }, use) => {
    const gamesCommands = businessFactory.createGamesCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    const authCommands = businessFactory.createAuthCommands();
    await authCommands.ensureLoggedIn();
    
    await use(gamesCommands);
  },
  
  navigationCommands: async ({ page, businessFactory }, use) => {
    const navigationCommands = businessFactory.createNavigationCommands();
    
    // Автоматическая авторизация
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    const authCommands = businessFactory.createAuthCommands();
    await authCommands.ensureLoggedIn();
    
    await use(navigationCommands);
  }
});

export { expect };

/**
 * Примеры использования новых фикстур:
 * 
 * // Базовый тест (без автоматической авторизации)
 * test('Login test', async ({ authCommands, navigationCommands }) => {
 *   await navigationCommands.gotoAndVerify(Routes.HOME);
 *   await authCommands.loginWithValidCredentials();
 * });
 * 
 * // Тест с автоматической авторизацией
 * authenticatedTest('Wallet test', async ({ walletCommands, profileCommands }) => {
 *   // Пользователь уже залогинен!
 *   await walletCommands.openWallet();
 *   const email = await profileCommands.getUserEmail();
 * });
 * 
 * // Комплексный тест
 * authenticatedTest('Complex flow', async ({ 
 *   authCommands, 
 *   walletCommands, 
 *   gamesCommands, 
 *   navigationCommands 
 * }) => {
 *   await navigationCommands.gotoAndVerify(Routes.SLOTS);
 *   const games = await gamesCommands.testRandomSlotsFromProvider('pragmatic', 3);
 *   await walletCommands.verifyBalanceVisible();
 * });
 */
