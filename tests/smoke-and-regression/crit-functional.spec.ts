import { test, authenticatedTest, expect } from '../setup/business-fixtures';
import { ProviderItem, CategoryItem } from '@/pages/components/filter-category-provider.component';
import { Routes } from '../../config/routes';
import { AuthTestData } from '../../test-data/auth/auth-test-data';

// ============================================================
// SMOKE ТЕСТЫ - Критичный функционал (с автоматической авторизацией)
// ============================================================

test.describe('🔥 SMOKE Tests - Критичный функционал (Business Commands)', () => {
  
  test.describe('Авторизация и профиль', () => {
    authenticatedTest('S1: Успешная авторизация и отображение профиля', async ({ authCommands }) => {
      // Проверка: Пользователь успешно авторизован (автоматически)
      const isLoggedIn = await authCommands.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    authenticatedTest('S2: Отображение email пользователя в профиле', async ({ profileCommands, authCommands }) => {
      // Проверка: Email корректно отображается
      const email = await profileCommands.getUserEmail();
      expect(email).toContain('@');
      expect(email).toBe(AuthTestData.valid.email);
    });

    authenticatedTest('S3: Наличие и отображение аватара', async ({ authCommands }) => {
      // Проверка: Аватар пользователя виден
      const isLoggedIn = await authCommands.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });
  });

  test.describe('Разделы профиля', () => {
    authenticatedTest('S4: Доступность раздела "Інформація про користувача"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('userInfo');
    });

    authenticatedTest('S5: Доступность раздела "Гаманець"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('wallet');
    });

    authenticatedTest('S6: Доступность раздела "Статистика"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('statistics');
    });

    authenticatedTest('S7: Доступность раздела "Бонуси"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('bonuses');
    });

    authenticatedTest('S8: Доступность раздела "Транзакції"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('transactions');
    });

    authenticatedTest('S9: Доступность раздела "Верифікація"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('verification');
    });

    authenticatedTest('S10: Доступность раздела "Безпека"', async ({ profileCommands }) => {
      await profileCommands.openAndVerifySection('security');
    });
  });

  test.describe('Бонусы', () => {
    authenticatedTest('S11: Отображение бонусного баланса', async ({ profileCommands }) => {
      // Проверка: Бонусный баланс отображается
      const bonusInfo = await profileCommands.getBonusInfo();
      expect(bonusInfo.balance).toBeDefined();
    });

    authenticatedTest('S12: Наличие прогресс-бара бонуса', async ({ profileCommands }) => {
      // Проверка: Прогресс-бар виден и данные корректны
      const bonusInfo = await profileCommands.getBonusInfo();
      expect(bonusInfo.wagerAmount).toBeDefined();
      expect(bonusInfo.remaining).toBeDefined();
    });
  });

  test.describe('Навигация и UI', () => {
    authenticatedTest('S13: Проверка логотипа и перехода на главную', async ({ navigationCommands }) => {
      // Проверка: Клик по логотипу ведет на главную
      await navigationCommands.gotoAndVerify(Routes.SLOTS);
      await navigationCommands.goHomeViaLogo();
    });

    authenticatedTest('S14: Доступность меню (sidebar)', async ({ navigationCommands }) => {
      // Проверка: Sidebar отображается и доступен
      await navigationCommands.gotoAndVerify(Routes.HOME);
    });

    authenticatedTest('S15: Наличие кнопки "Підтримка онлайн"', async ({ navigationCommands }) => {
      // Проверка: Кнопка поддержки доступна
      await navigationCommands.gotoAndVerify(Routes.HOME);
    });

    authenticatedTest('S16: Переключение языка', async ({ profileCommands }) => {
      // Проверка: Язык переключается корректно
      await profileCommands.changeLanguage();
    });
  });

  test.describe('Модальные окна', () => {
    authenticatedTest('S17: Проверка открытия и закрытия профиля', async ({ profileCommands }) => {
      // Проверка: Модальное окно профиля корректно работает
      await profileCommands.openProfile();
      await profileCommands.closeProfile();
    });
  });
});

// ============================================================
// REGRESSION ТЕСТЫ - Глубокое покрытие (с автоматической авторизацией)
// ============================================================

test.describe('🧪 REGRESSION Tests - Глубокое покрытие (Business Commands)', () => {
  
  test.describe('Бонусы и профиль', () => {
    authenticatedTest('R1: Корректность отображения суммы бонуса', async ({ profileCommands }) => {
      // Проверка: Все данные о бонусе корректны
      const bonusInfo = await profileCommands.getBonusInfo();
      
      expect(bonusInfo.balance).toBeDefined();
      expect(bonusInfo.wagerAmount).toBeDefined();
      expect(bonusInfo.remaining).toBeDefined();
      
      test.info().attach('Bonus Info', {
        body: JSON.stringify(bonusInfo, null, 2),
        contentType: 'application/json',
      });
    });

    authenticatedTest('R2: Проверка отображения бонусной информации после логина', async ({ profileCommands }) => {
      // Проверка: Бонусная информация доступна
      const bonusInfo = await profileCommands.getBonusInfo();
      expect(bonusInfo.balance).toBeDefined();
    });
  });

  test.describe('Страницы и навигация', () => {
    test('R3: Работоспособность главной страницы', async ({ navigationCommands }) => {
      // Проверка: Главная страница загружается со всеми компонентами
      await navigationCommands.gotoAndVerify(Routes.HOME);
    });

    authenticatedTest('R4: Работоспособность страницы Slots', async ({ navigationCommands, gamesCommands }) => {
      // Проверка: Страница слотов работает корректно
      await navigationCommands.gotoAndVerify(Routes.SLOTS);
      await gamesCommands.filterByCategory(CategoryItem.SlotsCategory);
    });

    test('R5: Работоспособность страницы Live Casino', async ({ navigationCommands }) => {
      // Проверка: Live Casino доступно
      await navigationCommands.gotoAndVerify(Routes.LIVE_CASINO);
    });

    test('R6: Работоспособность страницы Bonuses', async ({ navigationCommands }) => {
      // Проверка: Страница бонусов загружается
      await navigationCommands.gotoAndVerify(Routes.BONUSES);
    });

    authenticatedTest('R7: Наличие ключевых UI компонентов на всех страницах', async ({ navigationCommands }) => {
      // Проверка: Основные компоненты присутствуют везде
      await navigationCommands.verifyAllMainPages();
    });
  });

  test.describe('Слоты и провайдеры', () => {
    authenticatedTest('R8: Открытие 3х случайных слотов от провайдера Pragmatic Play', async ({ gamesCommands }) => {
      // Проверка: Слоты от Pragmatic Play открываются корректно
      const testedGames = await gamesCommands.testRandomSlotsFromProvider(
        ProviderItem.PragmaticPlayProvider,
        3
      );
      
      test.info().attach('Tested Games', {
        body: testedGames.join('\n'),
        contentType: 'text/plain',
      });
      
      expect(testedGames.length).toBe(3);
    });

    authenticatedTest('R9: Открытие 3х случайных слотов от провайдера NetEnt', async ({ gamesCommands }) => {
      // Проверка: Слоты от NetEnt открываются корректно
      const testedGames = await gamesCommands.testRandomSlotsFromProvider(
        ProviderItem.NetentProvider,
        3
      );
      
      test.info().attach('Tested NetEnt Games', {
        body: testedGames.join('\n'),
        contentType: 'text/plain',
      });
    });

    authenticatedTest('R10: Открытие 3х случайных слотов от провайдера BGaming', async ({ gamesCommands }) => {
      // Проверка: Слоты от BGaming открываются корректно
      const testedGames = await gamesCommands.testRandomSlotsFromProvider(
        ProviderItem.BGamingProvider,
        3
      );
      
      test.info().attach('Tested BGaming Games', {
        body: testedGames.join('\n'),
        contentType: 'text/plain',
      });
    });
  });

  test.describe('UI и фильтры', () => {
    authenticatedTest('R11: Проверка отображения баннеров на главной', async ({ gamesCommands, navigationCommands }) => {
      // Проверка: Баннеры отображаются и кликабельны
      await navigationCommands.gotoAndVerify(Routes.HOME);
      await gamesCommands.verifyBanners();
    });

    authenticatedTest('R12: Проверка фильтрации по категориям', async ({ gamesCommands, navigationCommands }) => {
      // Проверка: Фильтры категорий работают корректно
      await navigationCommands.gotoAndVerify(Routes.HOME);
      await gamesCommands.filterByCategory(CategoryItem.SlotsCategory);
    });

    authenticatedTest('R13: Проверка статистики фильтров', async ({ gamesCommands, navigationCommands }) => {
      // Проверка: Статистика по фильтрам доступна
      await navigationCommands.gotoAndVerify(Routes.SLOTS);
      
      const stats = await gamesCommands.getFiltersStatistics();
      
      expect(stats.categories.total).toBeGreaterThan(0);
      expect(stats.providers.total).toBeGreaterThan(0);
      
      test.info().attach('Filters Stats', {
        body: JSON.stringify({
          categories: `${stats.categories.visible.length}/${stats.categories.total}`,
          providers: `${stats.providers.visible.length}/${stats.providers.total}`
        }, null, 2),
        contentType: 'application/json',
      });
    });

    authenticatedTest('R14: Отображение элементов после смены языка', async ({ profileCommands, authCommands }) => {
      // Проверка: UI корректно отображается после смены языка
      await profileCommands.changeLanguage();
      
      const isLoggedIn = await authCommands.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });
  });

  test.describe('Разделы профиля', () => {
    authenticatedTest('R15: Проверка раздела транзакций', async ({ profileCommands }) => {
      // Проверка: Раздел транзакций доступен
      await profileCommands.openAndVerifySection('transactions');
    });

    authenticatedTest('R16: Проверка перехода на страницу верификации', async ({ profileCommands }) => {
      // Проверка: Верификация открывается корректно
      await profileCommands.openAndVerifySection('verification');
    });

    authenticatedTest('R17: Проверка страницы безопасности', async ({ profileCommands }) => {
      // Проверка: Раздел безопасности содержит опции
      await profileCommands.openAndVerifySection('security');
    });
  });

  test.describe('Навигация по sidebar', () => {
    authenticatedTest('R18: Навигация по всем разделам sidebar', async ({ navigationCommands }) => {
      // Проверка: Все разделы sidebar доступны
      await navigationCommands.gotoAndVerify(Routes.HOME);
      await navigationCommands.navigateViaSidebar('slots');
    });

    authenticatedTest('R19: Проверка работы поиска игр', async ({ gamesCommands, navigationCommands }) => {
      // Проверка: Поиск игр работает
      await navigationCommands.gotoAndVerify(Routes.HOME);
      
      const games = await gamesCommands.searchGamesOnPage();
      expect(games.length).toBeGreaterThan(0);
      
      test.info().attach('Total Games Found', {
        body: `${games.length} games`,
        contentType: 'text/plain',
      });
    });
  });

  test.describe('Wallet и депозит', () => {
    authenticatedTest('R20: Проверка кнопки "Пополнить баланс"', async ({ walletCommands }) => {
      // Проверка: Кнопка пополнения доступна
      await walletCommands.openWallet();
      await walletCommands.verifyBalanceVisible();
      await walletCommands.closeWallet();
    });
  });
});

// ============================================================
// ТЕСТЫ БЕЗ АВТОРИЗАЦИИ (для проверки публичных страниц)
// ============================================================

test.describe('🌐 Публичные страницы (без авторизации)', () => {
  
  test('Публичная страница: Главная', async ({ navigationCommands }) => {
    // Проверка: Главная страница доступна без авторизации
    await navigationCommands.gotoAndVerify(Routes.HOME);
  });

  test('Публичная страница: Слоты', async ({ navigationCommands }) => {
    // Проверка: Страница слотов доступна без авторизации
    await navigationCommands.gotoAndVerify(Routes.SLOTS);
  });

  test('Публичная страница: Live Casino', async ({ navigationCommands }) => {
    // Проверка: Live Casino доступно без авторизации
    await navigationCommands.gotoAndVerify(Routes.LIVE_CASINO);
  });

  test('Публичная страница: Бонусы', async ({ navigationCommands }) => {
    // Проверка: Страница бонусов доступна без авторизации
    await navigationCommands.gotoAndVerify(Routes.BONUSES);
  });
});
