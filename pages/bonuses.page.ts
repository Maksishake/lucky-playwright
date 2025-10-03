import { Page, Locator, expect } from '@playwright/test';
import { BasePageObject } from './base/base-page-object';

/**
 * Элементы страницы бонусов
 */
export enum BonusesPageItem {
  // Main container
  Container = '.container',
  PageTitle = '.page-title',

  // Bonus balance card
  BonusBalanceCard = '.bonus-balance',
  BonusBalanceTitle = '.bonus-balance .tab-name',
  BonusBalanceAmount = '.bonus-balance .bonus-info .title',

  // Bonus progress
  BonusProgress = '.bonus-progress',
  BonusProgressBar = '.bonus-progress .progress-bar',
  BonusLeftAmount = '.bonus-left span',
  BonusRightAmount = '.bonus-right span',
  BonusLeftLabel = '.bonus-label .bonus-left',
  BonusRightLabel = '.bonus-label .bonus-right',
  BonusLeftIcon = '.bonus-left img.icon',
  BonusRightIcon = '.bonus-right img.icon',

  // Promocode input
  PromocodeInput = 'input[placeholder*="промокод"]',
  PromocodeButton = 'button:has-text("Подати заявку")',
  PromocodeFormGroup = '.form-group.with-input-btn',

  // Banner
  Banner = '.banner.md\\:banner-sm',
  BannerImage = '.banner-image',
  BannerTitle = '.banner-title',
  BannerDescription = '.banner-left-col .body-default',

  // Tabs
  TabsSection = '.tabs.w-full',
  TabNav = '.tab-nav',
  TabItem = '.tab-item',
  TabItemActive = '.tab-item.active',
  TabDeposit = '.tab-item:has-text("Депозит")',
  TabCashback = '.tab-item:has-text("Кешбек")',
  TabGift = '.tab-item:has-text("Подарунковий")',

  // Bonus cards
  BonusCardsContainer = '.row.flex-col.gap-lg',
  BonusCard = '.card.card-promotion',
  BonusCardImage = '.card-image-wrapper img',
  BonusCardTitle = '.card-content-wrapper .title',
  BonusCardExcerpt = '.card-content-wrapper .excerpt',
  BonusCardButtonWrapper = '.card-content-wrapper .button-wrapper',
  BonusCardSubscribeButton = 'button:has-text("Підписатися")',
  BonusCardDetailsButton = 'button:has-text("Детальна інформація")',
}

/**
 * Page Object для страницы бонусов
 */
export class BonusesPage extends BasePageObject {
  constructor(page: Page) {
    super(page);
  }

  protected getBonusesPageSelector(): string {
    return BonusesPageItem.Container;
  }

  // ============================================================
  // Проверки загрузки и видимости
  // ============================================================

  async isLoaded(): Promise<boolean> {
    return await this.page.locator(BonusesPageItem.PageTitle).isVisible();
  }

  async waitForLoad(): Promise<void> {
    await expect(this.page.locator(BonusesPageItem.PageTitle)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(BonusesPageItem.BonusBalanceCard)).toBeVisible({ timeout: 10000 });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.locator(BonusesPageItem.PageTitle).innerText();
  }

  async expectPageTitleVisible(): Promise<void> {
    await expect(this.page.locator(BonusesPageItem.PageTitle)).toBeVisible();
  }

  // ============================================================
  // Группы методов
  // ============================================================

  bonusBalance = {
    /**
     * Получить заголовок секции бонусного баланса
     */
    getTitle: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusBalanceTitle).innerText();
    },

    /**
     * Получить сумму бонусного баланса
     */
    getAmount: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusBalanceAmount).innerText();
    },

    /**
     * Получить процент прогресса из атрибута style
     */
    getProgressPercentage: async (): Promise<string> => {
      const style = await this.page.locator(BonusesPageItem.BonusProgressBar).getAttribute('style');
      const match = style?.match(/width:\s*(\d+\.?\d*)%/);
      return match ? match[1] : '0';
    },

    /**
     * Получить сумму для отыгрыша (левая сторона)
     */
    getLeftAmount: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusLeftAmount).first().innerText();
    },

    /**
     * Получить оставшуюся сумму (правая сторона)
     */
    getRightAmount: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusRightAmount).last().innerText();
    },

    /**
     * Получить текст левого лейбла
     */
    getLeftLabel: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusLeftLabel).last().innerText();
    },

    /**
     * Получить текст правого лейбла
     */
    getRightLabel: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusRightLabel).last().innerText();
    },

    /**
     * Проверить видимость секции бонусного баланса
     */
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.BonusBalanceCard).isVisible();
    },

    /**
     * Проверить видимость прогресс-бара
     */
    isProgressVisible: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.BonusProgress).isVisible();
    },
  };

  promocode = {
    /**
     * Ввести промокод
     */
    fill: async (code: string): Promise<void> => {
      await this.page.locator(BonusesPageItem.PromocodeInput).fill(code);
    },

    /**
     * Получить текущий промокод из инпута
     */
    getValue: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.PromocodeInput).inputValue();
    },

    /**
     * Очистить поле промокода
     */
    clear: async (): Promise<void> => {
      await this.page.locator(BonusesPageItem.PromocodeInput).clear();
    },

    /**
     * Кликнуть на кнопку "Подати заявку"
     */
    submit: async (): Promise<void> => {
      await this.page.locator(BonusesPageItem.PromocodeButton).click();
      await this.page.waitForTimeout(500); // Ждем обработки
    },

    /**
     * Применить промокод (заполнить и отправить)
     */
    apply: async (code: string): Promise<void> => {
      await this.promocode.fill(code);
      await this.promocode.submit();
    },

    /**
     * Проверить видимость поля промокода
     */
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.PromocodeInput).isVisible();
    },

    /**
     * Проверить, что кнопка активна
     */
    isButtonEnabled: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.PromocodeButton).isEnabled();
    },
  };

  banner = {
    /**
     * Получить заголовок баннера
     */
    getTitle: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BannerTitle).innerText();
    },

    /**
     * Получить описание баннера
     */
    getDescription: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BannerDescription).innerText();
    },

    /**
     * Получить src изображения баннера
     */
    getImageSrc: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BannerImage).getAttribute('src') || '';
    },

    /**
     * Проверить видимость баннера
     */
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.Banner).isVisible();
    },
  };

  tabs = {
    /**
     * Кликнуть на таб "Депозит"
     */
    clickDeposit: async (): Promise<void> => {
      await this.page.locator(BonusesPageItem.TabDeposit).click();
      await this.page.waitForTimeout(500); // Ждем переключения таба
    },

    /**
     * Кликнуть на таб "Кешбек"
     */
    clickCashback: async (): Promise<void> => {
      await this.page.locator(BonusesPageItem.TabCashback).click();
      await this.page.waitForTimeout(500); // Ждем переключения таба
    },

    /**
     * Кликнуть на таб "Подарунковий"
     */
    clickGift: async (): Promise<void> => {
      await this.page.locator(BonusesPageItem.TabGift).click();
      await this.page.waitForTimeout(500); // Ждем переключения таба
    },

    /**
     * Получить текст активного таба
     */
    getActiveTab: async (): Promise<string> => {
      return await this.page.locator(BonusesPageItem.TabItemActive).innerText();
    },

    /**
     * Получить все табы
     */
    getAllTabs: async (): Promise<string[]> => {
      return await this.page.locator(BonusesPageItem.TabItem).allInnerTexts();
    },

    /**
     * Проверить, что таб "Депозит" активен
     */
    isDepositActive: async (): Promise<boolean> => {
      const activeTab = await this.tabs.getActiveTab();
      return activeTab.includes('Депозит');
    },

    /**
     * Проверить, что таб "Кешбек" активен
     */
    isCashbackActive: async (): Promise<boolean> => {
      const activeTab = await this.tabs.getActiveTab();
      return activeTab.includes('Кешбек');
    },

    /**
     * Проверить, что таб "Подарунковий" активен
     */
    isGiftActive: async (): Promise<boolean> => {
      const activeTab = await this.tabs.getActiveTab();
      return activeTab.includes('Подарунковий');
    },

    /**
     * Проверить видимость табов
     */
    isVisible: async (): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.TabsSection).isVisible();
    },
  };

  bonusCards = {
    /**
     * Получить количество карточек бонусов
     */
    getCount: async (): Promise<number> => {
      return await this.page.locator(BonusesPageItem.BonusCard).count();
    },

    /**
     * Получить карточку по индексу
     */
    getCardByIndex: async (index: number): Promise<Locator> => {
      return this.page.locator(BonusesPageItem.BonusCard).nth(index);
    },

    /**
     * Получить карточку по заголовку
     */
    getCardByTitle: async (title: string): Promise<Locator> => {
      return this.page.locator(BonusesPageItem.BonusCard).filter({ hasText: title });
    },

    /**
     * Получить заголовок карточки по индексу
     */
    getCardTitle: async (index: number): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusCard).nth(index).locator(BonusesPageItem.BonusCardTitle).innerText();
    },

    /**
     * Получить описание карточки по индексу
     */
    getCardExcerpt: async (index: number): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusCard).nth(index).locator(BonusesPageItem.BonusCardExcerpt).innerText();
    },

    /**
     * Получить src изображения карточки по индексу
     */
    getCardImageSrc: async (index: number): Promise<string> => {
      return await this.page.locator(BonusesPageItem.BonusCard).nth(index).locator(BonusesPageItem.BonusCardImage).getAttribute('src') || '';
    },

    /**
     * Кликнуть на кнопку "Підписатися" в карточке по индексу
     */
    clickSubscribe: async (index: number): Promise<void> => {
      await this.page.locator(BonusesPageItem.BonusCard).nth(index).locator(BonusesPageItem.BonusCardSubscribeButton).click();
      await this.page.waitForTimeout(500); // Ждем обработки
    },

    /**
     * Кликнуть на кнопку "Підписатися" в карточке по заголовку
     */
    clickSubscribeByTitle: async (title: string): Promise<void> => {
      const card = this.page.locator(BonusesPageItem.BonusCard).filter({ hasText: title });
      await card.locator(BonusesPageItem.BonusCardSubscribeButton).click();
      await this.page.waitForTimeout(500); // Ждем обработки
    },

    /**
     * Кликнуть на кнопку "Детальна інформація" в карточке по индексу
     */
    clickDetails: async (index: number): Promise<void> => {
      await this.page.locator(BonusesPageItem.BonusCard).nth(index).locator(BonusesPageItem.BonusCardDetailsButton).click();
      await this.page.waitForTimeout(500); // Ждем открытия модального окна
    },

    /**
     * Кликнуть на кнопку "Детальна інформація" в карточке по заголовку
     */
    clickDetailsByTitle: async (title: string): Promise<void> => {
      const card = this.page.locator(BonusesPageItem.BonusCard).filter({ hasText: title });
      await card.locator(BonusesPageItem.BonusCardDetailsButton).click();
      await this.page.waitForTimeout(500); // Ждем открытия модального окна
    },

    /**
     * Получить все заголовки карточек
     */
    getAllCardTitles: async (): Promise<string[]> => {
      return await this.page.locator(BonusesPageItem.BonusCardTitle).allInnerTexts();
    },

    /**
     * Проверить видимость карточки по индексу
     */
    isCardVisible: async (index: number): Promise<boolean> => {
      return await this.page.locator(BonusesPageItem.BonusCard).nth(index).isVisible();
    },

    /**
     * Hover на карточку по индексу
     */
    hoverCard: async (index: number): Promise<void> => {
      await this.page.locator(BonusesPageItem.BonusCard).nth(index).hover();
    },

    /**
     * Hover на карточку по заголовку
     */
    hoverCardByTitle: async (title: string): Promise<void> => {
      await this.page.locator(BonusesPageItem.BonusCard).filter({ hasText: title }).hover();
    },

    /**
     * Получить информацию о карточке (заголовок и описание)
     */
    getCardInfo: async (index: number): Promise<{ title: string; excerpt: string; imageSrc: string }> => {
      return {
        title: await this.bonusCards.getCardTitle(index),
        excerpt: await this.bonusCards.getCardExcerpt(index),
        imageSrc: await this.bonusCards.getCardImageSrc(index),
      };
    },

    /**
     * Получить информацию о всех карточках
     */
    getAllCardsInfo: async (): Promise<Array<{ title: string; excerpt: string; imageSrc: string }>> => {
      const cards: Array<{ title: string; excerpt: string; imageSrc: string }> = [];
      const count = await this.bonusCards.getCount();
      for (let i = 0; i < count; i++) {
        cards.push(await this.bonusCards.getCardInfo(i));
      }
      return cards;
    },
  };

  // ============================================================
  // Комплексные действия
  // ============================================================

  /**
   * Найти и подписаться на бонус по заголовку
   */
  async findAndSubscribeToBonus(title: string): Promise<void> {
    await this.bonusCards.clickSubscribeByTitle(title);
  }

  /**
   * Найти и открыть детальную информацию о бонусе по заголовку
   */
  async findAndOpenBonusDetails(title: string): Promise<void> {
    await this.bonusCards.clickDetailsByTitle(title);
  }

  /**
   * Переключиться на таб и получить количество бонусов
   */
  async switchTabAndGetBonusCount(tab: 'deposit' | 'cashback' | 'gift'): Promise<number> {
    switch (tab) {
      case 'deposit':
        await this.tabs.clickDeposit();
        break;
      case 'cashback':
        await this.tabs.clickCashback();
        break;
      case 'gift':
        await this.tabs.clickGift();
        break;
    }
    await this.page.waitForTimeout(1000); // Ждем загрузки карточек
    return await this.bonusCards.getCount();
  }

  /**
   * Применить промокод и проверить результат
   */
  async applyPromocodeAndVerify(code: string): Promise<void> {
    await this.promocode.apply(code);
    // Здесь можно добавить проверку успешного применения промокода
    // например, проверить изменение баланса или появление уведомления
  }

  /**
   * Проверить, что страница бонусов полностью загружена
   */
  async expectPageFullyLoaded(): Promise<void> {
    await expect(this.page.locator(BonusesPageItem.PageTitle)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.BonusBalanceCard)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.TabsSection)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.BonusCard).first()).toBeVisible();
  }

  /**
   * Проверить видимость всех основных элементов страницы
   */
  async expectAllMainElementsVisible(): Promise<void> {
    await expect(this.page.locator(BonusesPageItem.BonusBalanceCard)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.PromocodeInput)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.Banner)).toBeVisible();
    await expect(this.page.locator(BonusesPageItem.TabsSection)).toBeVisible();
  }
}

