import { Page, Locator, expect } from '@playwright/test';
import { BasePageObject } from '../base/base-page-object';
import { Routes } from '../../config/routes';

/**
 * Элементы Footer
 */
export enum FooterItem {
  // Основной элемент
  Footer = 'footer',
  
  // Логотип
  Logo = 'logo',
  
  // Навигация - игры
  AllGames = 'all-games',
  Popular = 'popular',
  New = 'new',
  Slots = 'slots',
  BuyBonus = 'buy-bonus',
  LiveCasino = 'live-casino',
  ShowGames = 'show-games',
  Favorites = 'favorites',
  Tournaments = 'tournaments',
  
  // Навигация - пользователь
  Wallet = 'wallet',
  UserInfo = 'user-info',
  PromoCode = 'promo-code',
  Bonus = 'bonus',
  
  // Навигация - условия
  TermsConditions = 'terms-conditions',
  BonusTerms = 'bonus-terms',
  ResponsibleGame = 'responsible-game',
  PrivacyPolicy = 'privacy-policy',
  
  // Платежные методы
  PaymentTON = 'payment-ton',
  PaymentBitcoin = 'payment-bitcoin',
  PaymentTether = 'payment-tether',
  PaymentLitecoin = 'payment-litecoin',
  PaymentTron = 'payment-tron',
  PaymentEthereum = 'payment-ethereum',
  
  // Социальные кнопки
  SupportButton = 'support-button',
  TelegramButton = 'telegram-button',
  
  // Лицензия и возраст
  BGALogo = 'bga-logo',
  AgeRestriction = 'age-restriction',
  
  // Копирайт
  Copyright = 'copyright',
  CopyrightLogo = 'copyright-logo',
}

/**
 * Page Object для Footer компонента
 * Представляет нижнюю часть страницы
 */
export class FooterPage extends BasePageObject {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    // Основной элемент
    footer: () => this.page.locator('footer'),
    
    // Логотип
    logo: () => this.page.locator('footer .footer-logo img'),
    
    // Навигация - игры (первая колонка)
    allGames: () => this.page.locator('footer .footer-nav-links li a[href*="/category/all"]'),
    popular: () => this.page.locator('footer .footer-nav-links li a[href*="/category/popular"]'),
    new: () => this.page.locator('footer .footer-nav-links li a[href*="/category/new"]'),
    slots: () => this.page.locator('footer .footer-nav-links li a[href*="/category/slots"]'),
    buyBonus: () => this.page.locator('footer .footer-nav-links li a[href*="/category/buy-bonus"]'),
    liveCasino: () => this.page.locator('footer .footer-nav-links li a[href*="/category/live-casino"]'),
    showGames: () => this.page.locator('footer .footer-nav-links li a[href*="/category/show-games"]'),
    favorites: () => this.page.locator('footer .footer-nav-links li a[href*="/favorite"]'),
    tournaments: () => this.page.locator('footer .footer-nav-links li a[href*="/tournaments"]'),
    
    // Навигация - пользователь (вторая колонка)
    wallet: () => this.page.locator('footer .footer-nav-links li a:has-text("Гаманець")'),
    userInfo: () => this.page.locator('footer .footer-nav-links li a:has-text("Інформація про користувача")'),
    promoCode: () => this.page.locator('footer .footer-nav-links li a:has-text("Промо-код")'),
    bonus: () => this.page.locator('footer .footer-nav-links li a[href*="/bonuses"]'),
    
    // Навигация - условия (третья колонка)
    termsConditions: () => this.page.locator('footer .footer-nav-links li a[href*="terms-n-conditions"]'),
    bonusTerms: () => this.page.locator('footer .footer-nav-links li a[href*="bonus-terms"]'),
    responsibleGame: () => this.page.locator('footer .footer-nav-links li a[href*="responsible-game"]'),
    privacyPolicy: () => this.page.locator('footer .footer-nav-links li a[href*="privacy-policy"]'),
    
    // Платежные методы
    paymentTON: () => this.page.locator('footer .payment-methods-icons img[src*="ton-logo"]'),
    paymentBitcoin: () => this.page.locator('footer .payment-methods-icons img[src*="bitcoin-logo"]'),
    paymentTether: () => this.page.locator('footer .payment-methods-icons img[src*="tether-logo"]'),
    paymentLitecoin: () => this.page.locator('footer .payment-methods-icons img[src*="litecoin-logo"]'),
    paymentTron: () => this.page.locator('footer .payment-methods-icons img[src*="tron-logo"]'),
    paymentEthereum: () => this.page.locator('footer .payment-methods-icons img[src*="ethereum-logo"]'),
    
    // Социальные кнопки
    supportButton: () => this.page.locator('footer button.btn-live-support'),
    telegramButton: () => this.page.locator('footer a.btn-social[href*="t.me"]'),
    
    // Лицензия и возраст
    bgaLogo: () => this.page.locator('footer .footer-bottom-middle_col img[src*="bga-logo"]'),
    ageRestriction: () => this.page.locator('footer .footer-bottom-middle_col .body-bold:has-text("18+")'),
    
    // Копирайт
    copyright: () => this.page.locator('footer .footer-bottom-right_col div span'),
    copyrightLogo: () => this.page.locator('footer .footer-bottom-right_col img[src*="copyright"]'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.locators.footer().isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.locators.footer()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ ВИДИМОСТИ ==========

  /**
   * Проверить, что footer виден
   */
  async expectFooterVisible(): Promise<void> {
    await expect(this.locators.footer()).toBeVisible();
  }

  /**
   * Проверить видимость логотипа
   */
  async expectLogoVisible(): Promise<void> {
    await expect(this.locators.logo()).toBeVisible();
  }

  // ========== НАВИГАЦИЯ - ИГРЫ ==========

  /**
   * Перейти ко всем играм
   */
  async goToAllGames(): Promise<void> {
    await this.locators.allGames().click();
    await this.page.waitForURL(`**${Routes.ALL}**`);
  }

  /**
   * Перейти к популярным играм
   */
  async goToPopular(): Promise<void> {
    await this.locators.popular().click();
    await this.page.waitForURL(`**${Routes.POPULAR}**`);
  }

  /**
   * Перейти к новым играм
   */
  async goToNew(): Promise<void> {
    await this.locators.new().click();
    await this.page.waitForURL(`**${Routes.NEW}**`);
  }

  /**
   * Перейти к слотам
   */
  async goToSlots(): Promise<void> {
    await this.locators.slots().click();
    await this.page.waitForURL(`**${Routes.SLOTS}**`);
  }

  /**
   * Перейти к Buy Bonus
   */
  async goToBuyBonus(): Promise<void> {
    await this.locators.buyBonus().click();
    await this.page.waitForURL(`**${Routes.BUY_BONUS}**`);
  }

  /**
   * Перейти к Live Casino
   */
  async goToLiveCasino(): Promise<void> {
    await this.locators.liveCasino().click();
    await this.page.waitForURL(`**${Routes.LIVE_CASINO}**`);
  }

  /**
   * Перейти к Show Games
   */
  async goToShowGames(): Promise<void> {
    await this.locators.showGames().click();
    await this.page.waitForURL(`**${Routes.SHOW_GAMES}**`);
  }

  /**
   * Перейти к избранному
   */
  async goToFavorites(): Promise<void> {
    await this.locators.favorites().click();
    await this.page.waitForURL(`**${Routes.FAVORITES}**`);
  }

  /**
   * Перейти к турнирам
   */
  async goToTournaments(): Promise<void> {
    await this.locators.tournaments().click();
    await this.page.waitForURL(`**${Routes.TOURNAMENTS}**`);
  }

  // ========== НАВИГАЦИЯ - ПОЛЬЗОВАТЕЛЬ ==========

  /**
   * Открыть кошелек
   */
  async openWallet(): Promise<void> {
    await this.locators.wallet().click();
  }

  /**
   * Открыть информацию о пользователе
   */
  async openUserInfo(): Promise<void> {
    await this.locators.userInfo().click();
  }

  /**
   * Открыть промокод
   */
  async openPromoCode(): Promise<void> {
    await this.locators.promoCode().click();
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<void> {
    await this.locators.bonus().click();
    await this.page.waitForURL(`**${Routes.BONUSES}**`);
  }

  // ========== НАВИГАЦИЯ - УСЛОВИЯ ==========

  /**
   * Перейти к условиям и положениям
   */
  async goToTermsConditions(): Promise<void> {
    await this.locators.termsConditions().click();
  }

  /**
   * Перейти к условиям бонусов
   */
  async goToBonusTerms(): Promise<void> {
    await this.locators.bonusTerms().click();
  }

  /**
   * Перейти к политике ответственной игры
   */
  async goToResponsibleGame(): Promise<void> {
    await this.locators.responsibleGame().click();
  }

  /**
   * Перейти к политике конфиденциальности
   */
  async goToPrivacyPolicy(): Promise<void> {
    await this.locators.privacyPolicy().click();
  }

  // ========== СОЦИАЛЬНЫЕ КНОПКИ ==========

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<void> {
    await this.locators.supportButton().click();
  }

  /**
   * Открыть Telegram
   */
  async openTelegram(): Promise<void> {
    await this.locators.telegramButton().click();
  }

  // ========== ПОЛУЧЕНИЕ ИНФОРМАЦИИ ==========

  /**
   * Получить текст копирайта
   */
  async getCopyrightText(): Promise<string | null> {
    try {
      const texts = await this.locators.copyright().allTextContents();
      return texts.join(' ');
    } catch {
      return null;
    }
  }

  /**
   * Проверить видимость возрастного ограничения
   */
  async isAgeRestrictionVisible(): Promise<boolean> {
    try {
      return await this.locators.ageRestriction().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить видимость логотипа BGA
   */
  async isBGALogoVisible(): Promise<boolean> {
    try {
      return await this.locators.bgaLogo().isVisible();
    } catch {
      return false;
    }
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Получить локатор элемента по типу
   */
  private getLocator(item: FooterItem): Locator {
    const locatorMap: Record<FooterItem, () => Locator> = {
      [FooterItem.Footer]: this.locators.footer,
      [FooterItem.Logo]: this.locators.logo,
      [FooterItem.AllGames]: this.locators.allGames,
      [FooterItem.Popular]: this.locators.popular,
      [FooterItem.New]: this.locators.new,
      [FooterItem.Slots]: this.locators.slots,
      [FooterItem.BuyBonus]: this.locators.buyBonus,
      [FooterItem.LiveCasino]: this.locators.liveCasino,
      [FooterItem.ShowGames]: this.locators.showGames,
      [FooterItem.Favorites]: this.locators.favorites,
      [FooterItem.Tournaments]: this.locators.tournaments,
      [FooterItem.Wallet]: this.locators.wallet,
      [FooterItem.UserInfo]: this.locators.userInfo,
      [FooterItem.PromoCode]: this.locators.promoCode,
      [FooterItem.Bonus]: this.locators.bonus,
      [FooterItem.TermsConditions]: this.locators.termsConditions,
      [FooterItem.BonusTerms]: this.locators.bonusTerms,
      [FooterItem.ResponsibleGame]: this.locators.responsibleGame,
      [FooterItem.PrivacyPolicy]: this.locators.privacyPolicy,
      [FooterItem.PaymentTON]: this.locators.paymentTON,
      [FooterItem.PaymentBitcoin]: this.locators.paymentBitcoin,
      [FooterItem.PaymentTether]: this.locators.paymentTether,
      [FooterItem.PaymentLitecoin]: this.locators.paymentLitecoin,
      [FooterItem.PaymentTron]: this.locators.paymentTron,
      [FooterItem.PaymentEthereum]: this.locators.paymentEthereum,
      [FooterItem.SupportButton]: this.locators.supportButton,
      [FooterItem.TelegramButton]: this.locators.telegramButton,
      [FooterItem.BGALogo]: this.locators.bgaLogo,
      [FooterItem.AgeRestriction]: this.locators.ageRestriction,
      [FooterItem.Copyright]: this.locators.copyright,
      [FooterItem.CopyrightLogo]: this.locators.copyrightLogo,
    };

    return locatorMap[item]();
  }

  /**
   * Проверить видимость элемента
   */
  async isElementVisible(item: FooterItem): Promise<boolean> {
    try {
      return await this.getLocator(item).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Кликнуть на элемент footer
   */
  async clickElement(item: FooterItem): Promise<void> {
    await this.getLocator(item).click();
  }

  // ========== ГРУППИРОВАННЫЕ МЕТОДЫ ==========

  /**
   * Группа методов для навигации по играм
   */
  games = {
    goToAll: async (): Promise<void> => {
      await this.goToAllGames();
    },

    goToPopular: async (): Promise<void> => {
      await this.goToPopular();
    },

    goToNew: async (): Promise<void> => {
      await this.goToNew();
    },

    goToSlots: async (): Promise<void> => {
      await this.goToSlots();
    },

    goToBuyBonus: async (): Promise<void> => {
      await this.goToBuyBonus();
    },

    goToLiveCasino: async (): Promise<void> => {
      await this.goToLiveCasino();
    },

    goToShowGames: async (): Promise<void> => {
      await this.goToShowGames();
    },

    goToFavorites: async (): Promise<void> => {
      await this.goToFavorites();
    },

    goToTournaments: async (): Promise<void> => {
      await this.goToTournaments();
    },
  };

  /**
   * Группа методов для пользовательских действий
   */
  user = {
    openWallet: async (): Promise<void> => {
      await this.openWallet();
    },

    openUserInfo: async (): Promise<void> => {
      await this.openUserInfo();
    },

    openPromoCode: async (): Promise<void> => {
      await this.openPromoCode();
    },

    goToBonuses: async (): Promise<void> => {
      await this.goToBonuses();
    },
  };

  /**
   * Группа методов для условий и политик
   */
  legal = {
    goToTermsConditions: async (): Promise<void> => {
      await this.goToTermsConditions();
    },

    goToBonusTerms: async (): Promise<void> => {
      await this.goToBonusTerms();
    },

    goToResponsibleGame: async (): Promise<void> => {
      await this.goToResponsibleGame();
    },

    goToPrivacyPolicy: async (): Promise<void> => {
      await this.goToPrivacyPolicy();
    },
  };

  /**
   * Группа методов для социальных кнопок
   */
  social = {
    openSupport: async (): Promise<void> => {
      await this.openSupport();
    },

    openTelegram: async (): Promise<void> => {
      await this.openTelegram();
    },
  };

  /**
   * Группа методов для проверки платежных методов
   */
  payments = {
    isTONVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentTON);
    },

    isBitcoinVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentBitcoin);
    },

    isTetherVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentTether);
    },

    isLitecoinVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentLitecoin);
    },

    isTronVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentTron);
    },

    isEthereumVisible: async (): Promise<boolean> => {
      return await this.isElementVisible(FooterItem.PaymentEthereum);
    },

    /*getAllVisible: async (): Promise<string[]> => {
      const payments = [];
      if (await this.isTONVisible()) payments.push('TON'); 
      if (await this.isBitcoinVisible()) payments.push('Bitcoin');
      if (await this.isTetherVisible()) payments.push('Tether');
      if (await this.isLitecoinVisible()) payments.push('Litecoin');
      if (await this.isTronVisible()) payments.push('Tron');
      if (await this.isEthereumVisible()) payments.push('Ethereum');
      return payments;*/
  };

  /**
   * Группа методов для информации
   */
  info = {
    getCopyright: async (): Promise<string | null> => {
      return await this.getCopyrightText();
    },

    isAgeRestrictionVisible: async (): Promise<boolean> => {
      return await this.isAgeRestrictionVisible();
    },

    isBGALogoVisible: async (): Promise<boolean> => {
      return await this.isBGALogoVisible();
    },
  };
}

