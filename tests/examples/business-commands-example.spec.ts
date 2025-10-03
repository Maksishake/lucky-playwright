/**
 * Пример использования Business Commands
 * Демонстрирует чистое разделение UI-слоя и бизнес-логики
 */

import { test, authenticatedTest, expect } from '../setup/business-fixtures';
import { Routes } from '../../config/routes';
import { AuthTestData } from '../../test-data/auth/auth-test-data';
import { ProviderItem } from '../../pages/components/filter-category-provider.component';

test.describe('🧪 Примеры Business Commands', () => {
  
  test.describe('Авторизация (без автоматической авторизации)', () => {
    
    test('Успешная авторизация', async ({ authCommands, navigationCommands }) => {
      // Переходим на главную
      await navigationCommands.gotoAndVerify(Routes.HOME);
      
      // Выполняем авторизацию
      await authCommands.loginWithValidCredentials();
      
      // Проверяем результат
      const isLoggedIn = await authCommands.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    test('Неуспешная авторизация', async ({ authCommands, navigationCommands }) => {
      await navigationCommands.gotoAndVerify(Routes.HOME);
      
      // Попытка авторизации с невалидными данными
      await authCommands.loginWithInvalidCredentials();
      
      // Проверяем, что авторизация не прошла
      await authCommands.verifyLoginFailure();
    });

    test('Регистрация нового пользователя', async ({ registrationCommands, navigationCommands }) => {
      await navigationCommands.gotoAndVerify(Routes.HOME);
      
      // Регистрация с тестовыми данными
      await registrationCommands.registerWithEmail(
        'newuser@test.com',
        'password123'
      );
    });
  });

  test.describe('Авторизованные пользователи (автоматическая авторизация)', () => {
    
    authenticatedTest('Работа с профилем', async ({ profileCommands }) => {
      // Пользователь уже залогинен!
      
      // Получаем email
      const email = await profileCommands.getUserEmail();
      expect(email).toContain('@');
      expect(email).toBe(AuthTestData.valid.email);
      
      // Проверяем бонусную информацию
      const bonusInfo = await profileCommands.getBonusInfo();
      expect(bonusInfo.balance).toBeDefined();
      expect(bonusInfo.wagerAmount).toBeDefined();
      expect(bonusInfo.remaining).toBeDefined();
    });

    authenticatedTest('Работа с кошельком', async ({ walletCommands }) => {
      // Открываем кошелек
      await walletCommands.openWallet();
      
      // Проверяем баланс
      await walletCommands.verifyBalanceVisible();
      
      // Закрываем кошелек
      await walletCommands.closeWallet();
    });

    authenticatedTest('Тестирование игр', async ({ gamesCommands }) => {
      // Тестируем 3 слота от Pragmatic Play
      const testedGames = await gamesCommands.testRandomSlotsFromProvider(
        ProviderItem.PragmaticPlayProvider,
        3
      );
      
      expect(testedGames.length).toBeGreaterThan(0);
      
      // Прикрепляем результат к отчету
      test.info().attach('Tested Games', {
        body: testedGames.join('\n'),
        contentType: 'text/plain',
      });
    });

    authenticatedTest('Навигация по сайту', async ({ navigationCommands, gamesCommands }) => {
      // Проверяем все основные страницы
      await navigationCommands.verifyAllMainPages();
      
      // Переходим к слотам через sidebar
      await navigationCommands.navigateViaSidebar('slots');
      
      // Проверяем баннеры
      await gamesCommands.verifyBanners();
    });
  });

  test.describe('Комплексные сценарии', () => {
    
    authenticatedTest('Полный пользовательский flow', async ({ 
      authCommands,
      profileCommands, 
      walletCommands, 
      gamesCommands,
      navigationCommands 
    }) => {
      // 1. Проверяем авторизацию
      const isLoggedIn = await authCommands.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
      
      // 2. Получаем данные профиля
      const email = await profileCommands.getUserEmail();
      expect(email).toBeDefined();
      
      // 3. Проверяем кошелек
      const balance = await walletCommands.openAndVerifyWallet();
      expect(balance).toBeDefined();
      
      // 4. Переходим к играм
      await navigationCommands.gotoAndVerify(Routes.SLOTS);
      
      // 5. Тестируем игры
      const games = await gamesCommands.searchGamesOnPage();
      expect(games.length).toBeGreaterThan(0);
      
      // 6. Проверяем статистику фильтров
      const stats = await gamesCommands.getFiltersStatistics();
      expect(stats.categories.total).toBeGreaterThan(0);
      expect(stats.providers.total).toBeGreaterThan(0);
      
      test.info().attach('Flow Results', {
        body: JSON.stringify({
          email,
          balance,
          gamesCount: games.length,
          categoriesCount: stats.categories.total,
          providersCount: stats.providers.total
        }, null, 2),
        contentType: 'application/json',
      });
    });

    authenticatedTest('Проверка всех разделов профиля', async ({ profileCommands }) => {
      const sections = ['userInfo', 'wallet', 'statistics', 'bonuses', 'transactions', 'verification', 'security'] as const;
      
      for (const section of sections) {
        await profileCommands.openAndVerifySection(section);
      }
    });

    authenticatedTest('Тестирование игр от всех провайдеров', async ({ gamesCommands }) => {
      const providers = [
        ProviderItem.PragmaticPlayProvider,
        ProviderItem.NetentProvider,
        ProviderItem.BGamingProvider
      ];
      
      const allTestedGames: string[] = [];
      
      for (const provider of providers) {
        const games = await gamesCommands.testRandomSlotsFromProvider(provider, 2);
        allTestedGames.push(...games);
      }
      
      expect(allTestedGames.length).toBeGreaterThan(0);
      
      test.info().attach('All Tested Games', {
        body: allTestedGames.join('\n'),
        contentType: 'text/plain',
      });
    });
  });
});
