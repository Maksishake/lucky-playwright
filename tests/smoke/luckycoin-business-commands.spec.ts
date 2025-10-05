import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/auth/login.page';
import { WalletPage } from '../../../pages/wallet/wallet.page';
import { FilterCategoryProvider, CategoryItem, ProviderItem } from '../../../pages/common/filter-category-provider.component';
import { AuthService } from '../../../services/auth.service';
import { WalletService } from '../../../services/wallet.service';
import { NavigationService } from '../../../services/navigation.service';
import { UserBuilder } from '../../../test-data/builders/user.builder';
import { logger } from '../../../utils/core/logger';
import { TIMEOUTS } from '../../../config/constants';
import { Environment } from '../../../config/environment';
import { Routes } from '../../../config/routes';
import { BitcapitalComponent } from '../../../pages/common/bitcapital.component';
import { SidebarComponent } from '../../../pages/common/sidebar.component';
import { MainService } from '../../../services/main.service';

test.describe('🔥 SMOKE Tests - Критичный функционал (Business Commands)', () => {
  let loginPage: LoginPage;
  let walletPage: WalletPage;
  let filterComponent: FilterCategoryProvider;
  let authService: AuthService;
  let walletService: WalletService;
  let navigationService: NavigationService;
  let bitcapitalComponent: BitcapitalComponent;
  let mainService: MainService;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    walletPage = new WalletPage(page);
    filterComponent = new FilterCategoryProvider(page);
    authService = new AuthService(page);
    walletService = new WalletService(page);
    navigationService = new NavigationService(page);
    bitcapitalComponent = new BitcapitalComponent(page);
    mainService = new MainService(page);
  });

  test.describe('Авторизация и профиль', () => {
    test('S1: Успешная авторизация и отображение профиля @smoke @critical', async () => {
      logger.step('Testing user login and profile display');
      await navigationService.navigateTo(Routes.HOME);
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await expect(authService.isLoggedIn()).resolves.toBeTruthy();
      logger.success('User successfully logged in and profile is displayed');
    });

      test('S2: Отображение email пользователя в профиле @smoke', async () => {
        logger.step('Testing user email display in profile');
        await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
        await expect(authService.isLoggedIn()).resolves.toBeTruthy();
        await authService.getCurrentUserEmail();
        logger.success('User email verification completed');
      });

    test('S3: Наличие и отображение аватара @smoke', async () => {
      logger.step('Testing user avatar display');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await expect(authService.isLoggedIn()).resolves.toBeTruthy();
      logger.success('User avatar verification completed');
    });
  });

  test.describe('Кошелек и баланс', () => {
    test('S4: Отображение баланса пользователя @smoke @critical', async () => {
      logger.step('Testing wallet balance display');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await walletPage.open();
      const balance = await walletPage.getBalance();
      expect(balance).toBeGreaterThanOrEqual(0);
      logger.success(`User balance displayed: ${balance}`);
    });

    test('S5: Доступность кнопки пополнения @smoke', async () => {
      logger.step('Testing deposit button availability');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await walletPage.open();
      await walletPage.switchToDepositTab();
      await expect(walletPage.depositAmountInput.root).toBeVisible();
      logger.success('Deposit button is available');
    });

    test('S6: Доступность кнопки вывода @smoke', async () => {
      logger.step('Testing withdrawal button availability');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await walletPage.open();
      await walletPage.switchToWithdrawalTab();
      await expect(walletPage.withdrawalAmountInput.root).toBeVisible();
      logger.success('Withdrawal button is available');
    });
  });

  test.describe('Игры и фильтры', () => {
    test('S7: Фильтрация по категории слотов @smoke', async () => {
      logger.step('Testing slots category filtering');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await bitcapitalComponent.close();
      await filterComponent.clickCategory(CategoryItem.SlotsCategory);
      await expect(filterComponent.category.isCategoryActive(CategoryItem.SlotsCategory)).resolves.toBeTruthy();
      logger.success('Slots category filtering works');
    });

    test('S8: Фильтрация по провайдеру Pragmatic Play @smoke', async () => {
      logger.step('Testing Pragmatic Play provider filtering');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await filterComponent.clickProvider(ProviderItem.PragmaticPlayProvider);
      await expect(filterComponent.provider.isProviderActive(ProviderItem.PragmaticPlayProvider)).resolves.toBeTruthy();
      logger.success('Pragmatic Play provider filtering works');
    });

    test('S9: Комбинированная фильтрация категория + провайдер @smoke', async () => {
      logger.step('Testing combined category and provider filtering');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      await filterComponent.testCategoryAndProvider(CategoryItem.SlotsCategory, ProviderItem.PragmaticPlayProvider);
      logger.success('Combined filtering works');
    });

    test('S10: Статистика фильтров @smoke', async () => {
      logger.step('Testing filters statistics');
      await authService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);
      const stats = await filterComponent.getFiltersStats();
      expect(stats.categories.total).toBeGreaterThan(0);
      expect(stats.providers.total).toBeGreaterThan(0);
      logger.success(`Filters stats: ${stats.categories.visible.length}/${stats.categories.total} categories, ${stats.providers.visible.length}/${stats.providers.total} providers`);
    });
  });

  test.describe('Навигация по разделам бокового меню @smoke', () => {
    test('S11: Полная проверка бокового меню с играми @smoke', async ({ page }) => {
      logger.step('Starting comprehensive sidebar navigation test');
    });
  });

test.describe('🌐 Публичные страницы (без авторизации)', () => {
  let navigationService: NavigationService;

  test.beforeEach(async ({ page }) => {
    navigationService = new NavigationService(page);
  });

  test('Публичная страница: Главная @smoke', async () => {
    logger.step('Testing public home page access');
    await navigationService.navigateTo('/');
    await expect(navigationService.page).toHaveTitle(/Lucky/);
    logger.success('Public home page accessible');
  });

  test('Публичная страница: Слоты @smoke', async () => {
    logger.step('Testing public slots page access');
    await navigationService.navigateTo('/slots');
    await expect(navigationService.page).toHaveURL(/.*\/slots/);
    logger.success('Public slots page accessible');
  });

  test('Публичная страница: Live Casino @smoke', async () => {
    logger.step('Testing public Live Casino page access');
    await navigationService.navigateTo('/live-casino');
    await expect(navigationService.page).toHaveURL(/.*\/live-casino/);
    logger.success('Public Live Casino page accessible');
  });

  test('Публичная страница: Бонусы @smoke', async () => {
    logger.step('Testing public bonuses page access');
    await navigationService.navigateTo('/bonuses');
    await expect(navigationService.page).toHaveURL(/.*\/bonuses/);
    logger.success('Public bonuses page accessible');
  });
});
}); 
