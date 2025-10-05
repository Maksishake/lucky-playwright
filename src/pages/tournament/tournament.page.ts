import { Locator, Page } from '@playwright/test';
import { BasePageObject } from '../base/BasePageObject';

export class TournamentsPage extends BasePageObject {
  readonly sidebar: Locator;
  readonly searchButton: Locator;
  readonly menuList: Locator;

  // Меню категорий
  readonly menuItemAll: Locator;
  readonly menuItemPopular: Locator;
  readonly menuItemNew: Locator;
  readonly menuItemSlots: Locator;
  readonly menuItemBuyBonus: Locator;
  readonly menuItemLiveCasino: Locator;
  readonly menuItemShowGames: Locator;
  readonly menuItemFavorites: Locator;
  readonly menuItemBonuses: Locator;
  readonly menuItemTournaments: Locator;
  readonly menuItemPromocode: Locator;

  // Нижняя панель
  readonly btnGetMoney: Locator;
  readonly btnTelegram: Locator;
  readonly btnLiveSupport: Locator;
  readonly btnLangToggle: Locator;
  readonly langDropdown: Locator;
  readonly langItemUa: Locator;

  // Карточки турниров
  readonly tournamentCards: Locator;
  readonly firstTournamentTitle: Locator;
  readonly joinButton: Locator;
  readonly detailsButton: Locator;

  // Уведомления
  readonly notificationPanel: Locator;
  readonly notificationTitle: Locator;
  readonly notificationClose: Locator;
  readonly notificationFilter: Locator;
  readonly notificationTabs: Locator;
  readonly notificationListItems: Locator;

  constructor(page: Page) {
    super(page);

    // SIDEBAR
    this.sidebar = page.locator('sidebar.menu');
    this.searchButton = this.sidebar.locator('button.search-toggle');
    this.menuList = this.sidebar.locator('ul.menu-list');

    this.menuItemAll = this.menuList.locator('a[href*="/category/all"]');
    this.menuItemPopular = this.menuList.locator('a[href*="/category/popular"]');
    this.menuItemNew = this.menuList.locator('a[href*="/category/new"]');
    this.menuItemSlots = this.menuList.locator('a[href*="/category/slots"]');
    this.menuItemBuyBonus = this.menuList.locator('a[href*="/category/buy-bonus"]');
    this.menuItemLiveCasino = this.menuList.locator('a[href*="/category/live-casino"]');
    this.menuItemShowGames = this.menuList.locator('a[href*="/category/show-games"]');
    this.menuItemFavorites = this.menuList.locator('a[href*="/favorite"]');
    this.menuItemBonuses = this.menuList.locator('a[href*="/bonuses"]');
    this.menuItemTournaments = this.menuList.locator('a[href*="/tournaments"]');
    this.menuItemPromocode = this.menuList.locator('a[href*="modal-promocode"]');

    // FOOTER BUTTONS
    this.btnGetMoney = this.sidebar.locator('a.btn-default:has-text("Отримати грошi")');
    this.btnTelegram = this.sidebar.locator('button[onclick*="t.me/lucky_coin_gold"]');
    this.btnLiveSupport = this.sidebar.locator('button.btn-live-support');
    this.btnLangToggle = this.sidebar.locator('button.btn-lang-wrapper');
    this.langDropdown = this.sidebar.locator('.lang-dropdown');
    this.langItemUa = this.langDropdown.locator('li[wire\\:click="setLocale(\'uk\')"]');

    // TOURNAMENT CARDS
    this.tournamentCards = page.locator('.card.card-promotion');
    this.firstTournamentTitle = this.tournamentCards.first().locator('.title');
    this.joinButton = this.tournamentCards.first().locator('button:has-text("Взяти участь")');
    this.detailsButton = this.tournamentCards.first().locator('button:has-text("Деталі")');

    // NOTIFICATION MODAL
    this.notificationPanel = page.locator('.modal-bar.notification');
    this.notificationTitle = this.notificationPanel.locator('.text-white');
    this.notificationClose = this.notificationPanel.locator('.notification-close');
    this.notificationFilter = this.notificationPanel.locator('.notification-filter');
    this.notificationTabs = this.notificationPanel.locator('.tab-nav .tab-item');
    this.notificationListItems = this.notificationPanel.locator('.notification-filter-list li');
  }

  async isLoaded(): Promise<boolean> {
    return await this.page.locator('.site-main').isVisible();
  }

  async waitForLoad(): Promise<void> {
    await this.page.locator('.site-main').waitFor({ state: 'visible' });
  }

  async openPromocodeModal(): Promise<void> {
    await this.menuItemPromocode.click();
  }

  async openFirstTournamentDetails(): Promise<void> {
    await this.detailsButton.click();
  }

  async switchToUaLanguage(): Promise<void> {
    await this.btnLangToggle.click();
    await this.langItemUa.click();
  }
}
