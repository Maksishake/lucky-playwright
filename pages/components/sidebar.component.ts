import { Page, Locator, expect } from '@playwright/test';
import { BasePageObject } from '../base/base-page-object';
import { Routes } from '../../config/routes';

/**
 * Элементы Sidebar
 */
export enum SidebarItem {
  // Основной элемент
  Sidebar = 'sidebar',
  
  // Поиск
  SearchButton = 'search-button',
  
  // Игровые категории
  All = 'all',
  Popular = 'popular',
  New = 'new',
  Slots = 'slots',
  BuyBonus = 'buy-bonus',
  LiveCasino = 'live-casino',
  ShowGames = 'show-games',
  Favorites = 'favorites',
  
  // Промо и бонусы
  Bonuses = 'bonuses',
  Tournaments = 'tournaments',
  PromoCode = 'promo-code',
  
  // Нижний блок
  BitcapitalButton = 'bitcapital-button',
  TelegramButton = 'telegram-button',
  SupportButton = 'support-button',
  LanguageButton = 'language-button',
  LanguageDropdown = 'language-dropdown',
  LanguageOptionUA = 'language-option-ua',
}

/**
 * Page Object для Sidebar компонента
 * Представляет боковую панель навигации
 */
export class SidebarPage extends BasePageObject {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    // Основной элемент
    sidebar: () => this.page.locator('sidebar.menu'),
    
    // Поиск
    searchButton: () => this.page.locator('sidebar button.search-toggle'),
    
    // Игровые категории
    allGames: () => this.page.locator('sidebar .menu-list li a[href*="/category/all"]'),
    popular: () => this.page.locator('sidebar .menu-list li a[href*="/category/popular"]'),
    new: () => this.page.locator('sidebar .menu-list li a[href*="/category/new"]'),
    slots: () => this.page.locator('sidebar .menu-list li a[href*="/category/slots"]'),
    buyBonus: () => this.page.locator('sidebar .menu-list li a[href*="/category/buy-bonus"]'),
    liveCasino: () => this.page.locator('sidebar .menu-list li a[href*="/category/live-casino"]'),
    showGames: () => this.page.locator('sidebar .menu-list li a[href*="/category/show-games"]'),
    favorites: () => this.page.locator('sidebar .menu-list li a[href*="/favorite"]'),
    
    // Промо и бонусы
    bonuses: () => this.page.locator('sidebar .menu-list li a[href*="/bonuses"]'),
    tournaments: () => this.page.locator('sidebar .menu-list li a[href*="/tournaments"]'),
    promoCode: () => this.page.locator('sidebar .menu-list li a:has-text("Промо-код")'),
    
    // Нижний блок
    bitcapitalButton: () => this.page.locator('sidebar .menu-block-bottom a[href*="bitcapital"]'),
    telegramButton: () => this.page.locator('sidebar .menu-block-bottom button[onclick*="t.me"]'),
    supportButton: () => this.page.locator('sidebar .menu-block-bottom button.btn-live-support'),
    languageButton: () => this.page.locator('sidebar .menu-block-bottom .btn-lang-wrapper .lang-toggle'),
    languageDropdown: () => this.page.locator('sidebar .menu-block-bottom .lang-dropdown'),
    languageOptionUA: () => this.page.locator('sidebar .lang-dropdown-list li:has-text("Український")'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.locators.sidebar().isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.locators.sidebar()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ ВИДИМОСТИ ==========

  /**
   * Проверить, что sidebar виден
   */
  async expectSidebarVisible(): Promise<void> {
    await expect(this.locators.sidebar()).toBeVisible();
  }

  /**
   * Проверить, что текущая страница видна
   */
  async expectCurrentPageVisible(): Promise<void> {
    await expect(this.page.locator('body')).toBeVisible();
  }

  // ========== ПОИСК ==========

  /**
   * Открыть поиск
   */
  async openSearch(): Promise<void> {
    await this.locators.searchButton().click();
  }

  // ========== НАВИГАЦИЯ ПО ИГРОВЫМ КАТЕГОРИЯМ ==========

  /**
   * Перейти в раздел "Все игры"
   */
  async goToAllGames(): Promise<void> {
    await this.locators.allGames().click();
    await this.page.waitForURL(`**${Routes.ALL}**`);
  }

  /**
   * Перейти в раздел "Популярные"
   */
  async goToPopular(): Promise<void> {
    await this.locators.popular().click();
    await this.page.waitForURL(`**${Routes.POPULAR}**`);
  }

  /**
   * Перейти в раздел "Новые"
   */
  async goToNew(): Promise<void> {
    await this.locators.new().click();
    await this.page.waitForURL(`**${Routes.NEW}**`);
  }

  /**
   * Перейти в раздел "Слоты"
   */
  async goToSlots(): Promise<void> {
    await this.locators.slots().click();
    await this.page.waitForURL(`**${Routes.SLOTS}**`);
  }

  /**
   * Перейти в раздел "Купить бонус"
   */
  async goToBuyBonus(): Promise<void> {
    await this.locators.buyBonus().click();
    await this.page.waitForURL(`**${Routes.BUY_BONUS}**`);
  }

  /**
   * Перейти в раздел "Live Casino"
   */
  async goToLiveCasino(): Promise<void> {
    await this.locators.liveCasino().click();
    await this.page.waitForURL(`**${Routes.LIVE_CASINO}**`);
  }

  /**
   * Перейти в раздел "Show Games"
   */
  async goToShowGames(): Promise<void> {
    await this.locators.showGames().click();
    await this.page.waitForURL(`**${Routes.SHOW_GAMES}**`);
  }

  /**
   * Перейти в раздел "Избранное"
   */
  async goToFavorites(): Promise<void> {
    await this.locators.favorites().click();
    await this.page.waitForURL(`**${Routes.FAVORITES}**`);
  }

  // ========== ПРОМО И БОНУСЫ ==========

  /**
   * Перейти в раздел "Бонусы"
   */
  async goToBonuses(): Promise<void> {
    await this.locators.bonuses().click();
    await this.page.waitForURL(`**${Routes.BONUSES}**`);
  }

  /**
   * Перейти в раздел "Турниры"
   */
  async goToTournaments(): Promise<void> {
    await this.locators.tournaments().click();
    await this.page.waitForURL(`**${Routes.TOURNAMENTS}**`);
  }

  /**
   * Открыть модальное окно промокода
   */
  async openPromoCode(): Promise<void> {
    await this.locators.promoCode().click();
  }

  // ========== НИЖНИЙ БЛОК ==========

  /**
   * Кликнуть на кнопку Bitcapital (Получить деньги)
   */
  async clickBitcapital(): Promise<void> {
    await this.locators.bitcapitalButton().click();
  }

  /**
   * Открыть Telegram
   */
  async openTelegram(): Promise<void> {
    await this.locators.telegramButton().click();
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<void> {
    await this.locators.supportButton().click();
  }

  /**
   * Кликнуть на кнопку языка
   */
  async clickLanguageButton(): Promise<void> {
    await this.locators.languageButton().click();
  }

  /**
   * Выбрать украинский язык
   */
  async selectLanguageUA(): Promise<void> {
    await this.clickLanguageButton();
    await this.locators.languageOptionUA().click();
  }

  // ========== ПРОВЕРКИ АКТИВНОЙ СТРАНИЦЫ ==========

  /**
   * Проверить, что элемент является текущей страницей
   */
  async isCurrentPage(item: SidebarItem): Promise<boolean> {
    try {
      const locator = this.getLocator(item);
      const parent = locator.locator('..');
      const classList = await parent.getAttribute('class');
      return classList?.includes('current-page') || false;
    } catch {
      return false;
    }
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Получить локатор элемента по типу
   */
  private getLocator(item: SidebarItem): Locator {
    const locatorMap: Record<SidebarItem, () => Locator> = {
      [SidebarItem.Sidebar]: this.locators.sidebar,
      [SidebarItem.SearchButton]: this.locators.searchButton,
      [SidebarItem.All]: this.locators.allGames,
      [SidebarItem.Popular]: this.locators.popular,
      [SidebarItem.New]: this.locators.new,
      [SidebarItem.Slots]: this.locators.slots,
      [SidebarItem.BuyBonus]: this.locators.buyBonus,
      [SidebarItem.LiveCasino]: this.locators.liveCasino,
      [SidebarItem.ShowGames]: this.locators.showGames,
      [SidebarItem.Favorites]: this.locators.favorites,
      [SidebarItem.Bonuses]: this.locators.bonuses,
      [SidebarItem.Tournaments]: this.locators.tournaments,
      [SidebarItem.PromoCode]: this.locators.promoCode,
      [SidebarItem.BitcapitalButton]: this.locators.bitcapitalButton,
      [SidebarItem.TelegramButton]: this.locators.telegramButton,
      [SidebarItem.SupportButton]: this.locators.supportButton,
      [SidebarItem.LanguageButton]: this.locators.languageButton,
      [SidebarItem.LanguageDropdown]: this.locators.languageDropdown,
      [SidebarItem.LanguageOptionUA]: this.locators.languageOptionUA,
    };

    return locatorMap[item]();
  }

  /**
   * Проверить видимость элемента
   */
  async isElementVisible(item: SidebarItem): Promise<boolean> {
    try {
      return await this.getLocator(item).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Кликнуть на элемент sidebar
   */
  async clickElement(item: SidebarItem): Promise<void> {
    await this.getLocator(item).click();
  }

  // ========== ГРУППИРОВАННЫЕ МЕТОДЫ ==========

  /**
   * Группа методов для работы с игровыми категориями
   */
  games = {
    clickOnAll: async (): Promise<void> => {
      await this.goToAllGames();
    },

    clickOnPopular: async (): Promise<void> => {
      await this.goToPopular();
    },

    clickOnNew: async (): Promise<void> => {
      await this.goToNew();
    },

    clickOnSlots: async (): Promise<void> => {
      await this.goToSlots();
    },

    clickOnBuyBonus: async (): Promise<void> => {
      await this.goToBuyBonus();
    },

    clickOnLiveCasino: async (): Promise<void> => {
      await this.goToLiveCasino();
    },

    clickOnShowGames: async (): Promise<void> => {
      await this.goToShowGames();
    },

    clickOnFavorites: async (): Promise<void> => {
      await this.goToFavorites();
    },
  };

  /**
   * Группа методов для работы с бонусами и промо
   */
  bonuses = {
    clickOnBonuses: async (): Promise<void> => {
      await this.goToBonuses();
    },

    clickOnTournaments: async (): Promise<void> => {
      await this.goToTournaments();
    },

    clickOnPromoCode: async (): Promise<void> => {
      await this.openPromoCode();
    },
  };

  /**
   * Группа методов для работы с поиском
   */
  search = {
    open: async (): Promise<void> => {
      await this.openSearch();
    },

    isVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(SidebarItem.SearchButton);
    },
  };

  /**
   * Группа методов для нижнего блока
   */
  footer = {
    clickBitcapital: async (): Promise<void> => {
      await this.clickBitcapital();
    },

    openTelegram: async (): Promise<void> => {
      await this.openTelegram();
    },

    openSupport: async (): Promise<void> => {
      await this.openSupport();
    },

    selectLanguageUA: async (): Promise<void> => {
      await this.selectLanguageUA();
    },

    clickLanguage: async (): Promise<void> => {
      await this.clickLanguageButton();
    },
  };

  /**
   * Группа методов для проверки активной страницы
   */
  navigation = {
    isAllGamesActive: async (): Promise<boolean> => {
      return await this.isCurrentPage(SidebarItem.All);
    },

    isPopularActive: async (): Promise<boolean> => {
      return await this.isCurrentPage(SidebarItem.Popular);
    },

    isSlotsActive: async (): Promise<boolean> => {
      return await this.isCurrentPage(SidebarItem.Slots);
    },

    isFavoritesActive: async (): Promise<boolean> => {
      return await this.isCurrentPage(SidebarItem.Favorites);
    },
  };

  // ========== АЛИАСЫ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ ==========

  /**
   * @deprecated Используйте footer.openSupport()
   */
  async walletClick(): Promise<void> {
    // Кошелек открывается через Header, а не Sidebar
    // Оставляем для обратной совместимости
    console.warn('walletClick() is deprecated. Use HeaderPage to open wallet.');
  }

  /**
   * @deprecated Используйте navigation.isAllGamesActive()
   */
  async isLoggedIn(): Promise<boolean> {
    // Проверка авторизации через Header, а не Sidebar
    console.warn('isLoggedIn() is deprecated. Use HeaderPage.auth.isLoggedIn() instead.');
    return false;
  }

  /**
   * @deprecated Используйте expectSidebarVisible()
   */
  async expectHiddenNavbarAfterLogout(): Promise<void> {
    // Этот метод относится к Header, а не к Sidebar
    console.warn('expectHiddenNavbarAfterLogout() is deprecated.');
  }
}
