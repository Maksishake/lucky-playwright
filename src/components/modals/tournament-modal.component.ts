import { Locator, Page } from '@playwright/test';
import { BaseModal } from '@core/abstract/base.modal';

export class TournamentModalComponent extends BaseModal {
  // === Основные контейнеры ===
  readonly modalRoot: Locator;
  readonly modalDialog: Locator;
  readonly modalContent: Locator;
  readonly modalHeader: Locator;
  readonly modalBody: Locator;

  // === Заголовок и закрытие ===
  readonly title: Locator;
  readonly closeButton: Locator;

  // === Промо карточка турнира ===
  readonly promoCard: Locator;
  readonly promoImage: Locator;
  readonly prizeFundBadge: Locator;
  readonly timeLeftBadge: Locator;
  readonly timeLeftTimer: Locator;
  readonly tournamentTitle: Locator;
  readonly tournamentDescription: Locator;
  readonly joinButton: Locator;

  // === Collapse "Правила" ===
  readonly collapseSection: Locator;
  readonly collapseHeader: Locator;
  readonly collapseIcon: Locator;
  readonly collapseAnswer: Locator;
  readonly rulesList: Locator;
  readonly prizeTable: Locator;
  readonly prizeRows: Locator;

  // === Блок победителей ===
  readonly winnersTitle: Locator;
  readonly winnersTable: Locator;
  readonly winnersTableRows: Locator;
  readonly winnersTableCity: Locator;
  readonly winnersTablePlayer: Locator;
  readonly winnersTablePoints: Locator;
  readonly winnersTablePrize: Locator;

  // === Игровые карточки ===
  readonly gameCards: Locator;

  constructor(page: Page, root: Locator) {
    super(page, root, 'Tournament Modal');

    // === Основная структура ===
    this.modalRoot = root;
    this.modalDialog = this.modalRoot.locator('.modal-dialog');
    this.modalContent = this.modalRoot.locator('.modal-content');
    this.modalHeader = this.modalRoot.locator('.modal-header');
    this.modalBody = this.modalRoot.locator('.modal-body');

    // === Заголовок и закрытие ===
    this.title = this.modalHeader.locator('.modal-title');
    this.closeButton = this.modalHeader.locator('.modal-close');

    // === Промо карточка турнира ===
    this.promoCard = this.modalBody.locator('.card.card-promotion');
    this.promoImage = this.promoCard.locator('.card-image');
    this.prizeFundBadge = this.promoCard.locator('.badge.bg-blue-opacity');
    this.timeLeftBadge = this.promoCard.locator('.badge.bg-orange-opacity');
    this.timeLeftTimer = this.timeLeftBadge.locator('#timerTournamentDetails6');
    this.tournamentTitle = this.promoCard.locator('.title');
    this.tournamentDescription = this.promoCard.locator('.excerpt');
    this.joinButton = this.promoCard.locator('button:has-text("Взяти участь")');

    // === Collapse "Правила" ===
    this.collapseSection = this.modalBody.locator('.collapse');
    this.collapseHeader = this.collapseSection.locator('.collapse-heading');
    this.collapseIcon = this.collapseSection.locator('.collapse-question .icon');
    this.collapseAnswer = this.collapseSection.locator('.collapse-answer');
    this.rulesList = this.collapseAnswer.locator('ul');
    this.prizeTable = this.collapseAnswer.locator('table.leaderboard, table');
    this.prizeRows = this.prizeTable.locator('tbody tr');

    // === Блок победителей ===
    this.winnersTitle = this.modalBody.locator('.slider-title span:has-text("Переможці турниру")');
    this.winnersTable = this.modalBody.locator('table.leaderboard');
    this.winnersTableRows = this.winnersTable.locator('tbody tr');
    this.winnersTableCity = this.winnersTable.locator('tbody tr td:nth-child(1) span');
    this.winnersTablePlayer = this.winnersTable.locator('tbody tr td:nth-child(2) span');
    this.winnersTablePoints = this.winnersTable.locator('tbody tr td:nth-child(3) span');
    this.winnersTablePrize = this.winnersTable.locator('tbody tr td:nth-child(4) span');

    // === Игровые карточки ===
    this.gameCards = this.modalBody.locator('.game-card, .card');
  }

  // === Методы взаимодействия ===
  async isLoaded(): Promise<boolean> {
    return this.modalRoot.isVisible();
  }

  async waitForLoad(): Promise<void> {
    await this.modalRoot.waitFor({ state: 'visible' });
  }

  async joinTournament(): Promise<void> {
    await this.joinButton.click();
  }

  async expandRules(): Promise<void> {
    await this.collapseHeader.click();
  }

  async getPrizeRows(): Promise<number> {
    return this.prizeRows.count();
  }

  async getWinnersCount(): Promise<number> {
    return this.winnersTableRows.count();
  }

  async startDemoGameByTitle(gameName: string): Promise<void> {
    const card = this.gameCards.filter({ hasText: gameName });
    await card.locator('button:has-text("Демо")').click();
  }

  async startRealGameByTitle(gameName: string): Promise<void> {
    const card = this.gameCards.filter({ hasText: gameName });
    await card.locator('button:has-text("Реальний")').click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
