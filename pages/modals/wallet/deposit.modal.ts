import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Элементы модального окна пополнения кошелька
 */
export enum WalletDepositModalItem {
  // Основные элементы
  Modal = 'modal',
  ModalTitle = 'modal-title',
  CloseButton = 'close-button',
  
  // Табы основные
  TabDeposit = 'tab-deposit',
  TabWithdraw = 'tab-withdraw',
  
  // Блок баланса
  Balance = 'balance',
  BalanceFiat = 'balance-fiat',
  BalanceCrypto = 'balance-crypto',
  HistoryButton = 'history-button',
  
  // Табы типов оплаты
  TabCard = 'tab-card',
  TabCrypto = 'tab-crypto',
  TabCashback = 'tab-cashback',
  
  // Форма картки
  AmountInput = 'amount-input',
  AmountLabel = 'amount-label',
  AmountMinMax = 'amount-min-max',
  BitcapitalButton = 'bitcapital-button',
  
  // Форма крипто
  TokenDropdown = 'token-dropdown',
  TokenUSDT = 'token-usdt',
  TokenUSDC = 'token-usdc',
  NetworkDropdown = 'network-dropdown',
  NetworkTron = 'network-tron',
  NetworkEthereum = 'network-ethereum',
  NetworkPolygon = 'network-polygon',
  NetworkBSC = 'network-bsc',
  NetworkTON = 'network-ton',
  
  // Форма кэшбэка
  CashbackInput = 'cashback-input',
  CashbackBalance = 'cashback-balance',
  
  // Кнопки
  SelectBonusButton = 'select-bonus-button',
  NextButton = 'next-button',
  DepositButton = 'deposit-button',
  DepositByCashbackButton = 'deposit-by-cashback-button',
}

/**
 * Page Object для модального окна пополнения кошелька
 */
export class WalletDepositModal extends BaseModal {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    // Основные элементы
    modal: () => this.page.locator('#modal-wallet-v4'),
    modalTitle: () => this.page.locator('#modal-wallet-v4 .modal-title'),
    closeButton: () => this.page.locator('#modal-wallet-v4 .modal-close'),
    
    // Табы основные
    tabDeposit: () => this.page.locator('#modal-wallet-v4 .tab-nav li.tab-item:has-text("Поповнити рахунок")'),
    tabWithdraw: () => this.page.locator('#modal-wallet-v4 .tab-nav li.tab-item:has-text("Вивести")'),
    
    // Блок баланса
    balance: () => this.page.locator('#modal-wallet-v4 .row-card.bg-gray-dark'),
    balanceFiat: () => this.page.locator('#modal-wallet-v4 .amount.amount-xl'),
    balanceCrypto: () => this.page.locator('#modal-wallet-v4 .text-white.body-bold span'),
    historyButton: () => this.page.locator('#modal-wallet-v4 .badge.badge-outline:has-text("Історія")'),
    
    // Табы типов оплаты
    tabCard: () => this.page.locator('#modal-wallet-v4 .tabs-underline .tab-nav li:has-text("Картки")'),
    tabCrypto: () => this.page.locator('#modal-wallet-v4 .tabs-underline .tab-nav li:has-text("Crypto")'),
    tabCashback: () => this.page.locator('#modal-wallet-v4 .tabs-underline .tab-nav li:has-text("Кэшбэк")'),
    
    // Форма картки
    amountInput: () => this.page.locator('#modal-wallet-v4 input[type="number"][placeholder="Сума"]'),
    amountLabel: () => this.page.locator('#modal-wallet-v4 label[for="input-max"]'),
    amountMinMax: () => this.page.locator('#modal-wallet-v4 .body-sm.text-default'),
    bitcapitalButton: () => this.page.locator('#modal-wallet-v4 .form-group.radio-proveder .form-group-container'),
    
    // Форма крипто
    tokenDropdown: () => this.page.locator('#modal-wallet-v4 .form-select:has-text("Token") button'),
    tokenUSDT: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("USDT")'),
    tokenUSDC: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("USDC")'),
    networkDropdown: () => this.page.locator('#modal-wallet-v4 .form-select:has-text("Мережа") button'),
    networkTron: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("Tron")'),
    networkEthereum: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("Ethereum")'),
    networkPolygon: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("Polygon")'),
    networkBSC: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("Binance Smart Chain")'),
    networkTON: () => this.page.locator('#modal-wallet-v4 .form-select-options li:has-text("TON")'),
    
    // Форма кэшбэка
    cashbackInput: () => this.page.locator('#modal-wallet-v4 input#cashbackAmount'),
    cashbackBalance: () => this.page.locator('#modal-wallet-v4 .tab-content:has(#cashbackAmount) .amount.amount-xl'),
    
    // Кнопки
    selectBonusButton: () => this.page.locator('#modal-wallet-v4 button.btn-outline:has-text("Виберіть бонус")'),
    nextButton: () => this.page.locator('#modal-wallet-v4 button.btn-default:has-text("Далі")'),
    depositButton: () => this.page.locator('#modal-wallet-v4 button.btn-default.btn-lg'),
    depositByCashbackButton: () => this.page.locator('#modal-wallet-v4 button:has-text("Поповнити рахунок")'),
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.locators.modal()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ МОДАЛЬНОГО ОКНА ==========

  async isOpen(): Promise<boolean> {
    try {
      return await this.locators.modal().isVisible();
    } catch {
      return false;
    }
  }

  async open(): Promise<void> {
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    await this.locators.closeButton().click();
  }

  // ========== ПОЛУЧЕНИЕ ИНФОРМАЦИИ ==========

  /**
   * Получить заголовок модального окна
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.locators.modalTitle().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить баланс в фиате
   */
  async getBalanceFiat(): Promise<string | null> {
    try {
      return await this.locators.balanceFiat().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить баланс в крипте
   */
  async getBalanceCrypto(): Promise<string | null> {
    try {
      return await this.locators.balanceCrypto().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Получить минимальную и максимальную сумму
   */
  async getMinMaxAmount(): Promise<string | null> {
    try {
      return await this.locators.amountMinMax().textContent();
    } catch {
      return null;
    }
  }

  // ========== ПЕРЕКЛЮЧЕНИЕ ТАБОВ ==========

  /**
   * Переключиться на таб "Пополнить счет"
   */
  async clickTabDeposit(): Promise<void> {
    await this.locators.tabDeposit().click();
  }

  /**
   * Переключиться на таб "Вывести"
   */
  async clickTabWithdraw(): Promise<void> {
    await this.locators.tabWithdraw().click();
  }

  /**
   * Переключиться на таб "Карты"
   */
  async clickTabCard(): Promise<void> {
    await this.locators.tabCard().click();
  }

  /**
   * Переключиться на таб "Crypto"
   */
  async clickTabCrypto(): Promise<void> {
    await this.locators.tabCrypto().click();
  }

  /**
   * Переключиться на таб "Кэшбэк"
   */
  async clickTabCashback(): Promise<void> {
    await this.locators.tabCashback().click();
  }

  // ========== РАБОТА С ФОРМОЙ КАРТЫ ==========

  /**
   * Заполнить сумму пополнения
   */
  async fillAmount(amount: string | number): Promise<void> {
    await this.locators.amountInput().fill(amount.toString());
  }

  /**
   * Получить значение суммы
   */
  async getAmount(): Promise<string> {
    return await this.locators.amountInput().inputValue();
  }

  /**
   * Очистить поле суммы
   */
  async clearAmount(): Promise<void> {
    await this.locators.amountInput().clear();
  }

  /**
   * Кликнуть на Bitcapital
   */
  async clickBitcapital(): Promise<void> {
    await this.locators.bitcapitalButton().click();
  }

  // ========== РАБОТА С ФОРМОЙ КРИПТО ==========

  /**
   * Открыть выбор токена
   */
  async openTokenDropdown(): Promise<void> {
    await this.locators.tokenDropdown().click();
  }

  /**
   * Выбрать токен USDT
   */
  async selectTokenUSDT(): Promise<void> {
    await this.openTokenDropdown();
    await this.locators.tokenUSDT().click();
  }

  /**
   * Выбрать токен USDC
   */
  async selectTokenUSDC(): Promise<void> {
    await this.openTokenDropdown();
    await this.locators.tokenUSDC().click();
  }

  /**
   * Открыть выбор сети
   */
  async openNetworkDropdown(): Promise<void> {
    await this.locators.networkDropdown().click();
  }

  /**
   * Выбрать сеть Tron
   */
  async selectNetworkTron(): Promise<void> {
    await this.openNetworkDropdown();
    await this.locators.networkTron().click();
  }

  /**
   * Выбрать сеть Ethereum
   */
  async selectNetworkEthereum(): Promise<void> {
    await this.openNetworkDropdown();
    await this.locators.networkEthereum().click();
  }

  /**
   * Выбрать сеть Polygon
   */
  async selectNetworkPolygon(): Promise<void> {
    await this.openNetworkDropdown();
    await this.locators.networkPolygon().click();
  }

  /**
   * Выбрать сеть BSC
   */
  async selectNetworkBSC(): Promise<void> {
    await this.openNetworkDropdown();
    await this.locators.networkBSC().click();
  }

  /**
   * Выбрать сеть TON
   */
  async selectNetworkTON(): Promise<void> {
    await this.openNetworkDropdown();
    await this.locators.networkTON().click();
  }

  // ========== РАБОТА С ФОРМОЙ КЭШБЭКА ==========

  /**
   * Заполнить сумму кэшбэка
   */
  async fillCashbackAmount(amount: string | number): Promise<void> {
    await this.locators.cashbackInput().fill(amount.toString());
  }

  /**
   * Получить баланс кэшбэка
   */
  async getCashbackBalance(): Promise<string | null> {
    try {
      return await this.locators.cashbackBalance().textContent();
    } catch {
      return null;
    }
  }

  // ========== ДЕЙСТВИЯ С КНОПКАМИ ==========

  /**
   * Кликнуть на "Выбрать бонус"
   */
  async clickSelectBonus(): Promise<void> {
    await this.locators.selectBonusButton().click();
  }

  /**
   * Кликнуть на "Далее" (для карты)
   */
  async clickNext(): Promise<void> {
    await this.locators.nextButton().click();
  }

  /**
   * Кликнуть на "Пополнить счет" (для кэшбэка)
   */
  async clickDepositByCashback(): Promise<void> {
    await this.locators.depositByCashbackButton().click();
  }

  /**
   * Открыть историю транзакций
   */
  async openHistory(): Promise<void> {
    await this.locators.historyButton().click();
  }

  // ========== КОМПЛЕКСНЫЕ ДЕЙСТВИЯ ==========

  /**
   * Пополнить счет картой
   */
  async depositByCard(amount: string | number, selectBonus: boolean = false): Promise<void> {
    await this.clickTabCard();
    await this.fillAmount(amount);
    
    if (selectBonus) {
      await this.clickSelectBonus();
    }
    
    await this.clickNext();
  }

  /**
   * Пополнить счет криптой
   */
  async depositByCrypto(token: 'USDT' | 'USDC', network: 'Tron' | 'Ethereum' | 'Polygon' | 'BSC' | 'TON'): Promise<void> {
    await this.clickTabCrypto();
    
    // Выбираем токен
    if (token === 'USDT') {
      await this.selectTokenUSDT();
    } else {
      await this.selectTokenUSDC();
    }
    
    // Выбираем сеть
    switch (network) {
      case 'Tron':
        await this.selectNetworkTron();
        break;
      case 'Ethereum':
        await this.selectNetworkEthereum();
        break;
      case 'Polygon':
        await this.selectNetworkPolygon();
        break;
      case 'BSC':
        await this.selectNetworkBSC();
        break;
      case 'TON':
        await this.selectNetworkTON();
        break;
    }
  }

  /**
   * Пополнить счет кэшбэком
   */
  async depositByCashbackAmount(amount: string | number): Promise<void> {
    await this.clickTabCashback();
    await this.fillCashbackAmount(amount);
    await this.clickDepositByCashback();
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, активен ли таб "Карты"
   */
  async isTabCardActive(): Promise<boolean> {
    try {
      const classList = await this.locators.tabCard().getAttribute('class');
      return classList?.includes('active') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, активен ли таб "Crypto"
   */
  async isTabCryptoActive(): Promise<boolean> {
    try {
      const classList = await this.locators.tabCrypto().getAttribute('class');
      return classList?.includes('active') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить видимость поля суммы
   */
  async isAmountInputVisible(): Promise<boolean> {
    try {
      return await this.locators.amountInput().isVisible();
    } catch {
      return false;
    }
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Получить локатор элемента по типу
   */
  private getLocator(item: WalletDepositModalItem): Locator {
    const locatorMap: Record<WalletDepositModalItem, () => Locator> = {
      [WalletDepositModalItem.Modal]: this.locators.modal,
      [WalletDepositModalItem.ModalTitle]: this.locators.modalTitle,
      [WalletDepositModalItem.CloseButton]: this.locators.closeButton,
      [WalletDepositModalItem.TabDeposit]: this.locators.tabDeposit,
      [WalletDepositModalItem.TabWithdraw]: this.locators.tabWithdraw,
      [WalletDepositModalItem.Balance]: this.locators.balance,
      [WalletDepositModalItem.BalanceFiat]: this.locators.balanceFiat,
      [WalletDepositModalItem.BalanceCrypto]: this.locators.balanceCrypto,
      [WalletDepositModalItem.HistoryButton]: this.locators.historyButton,
      [WalletDepositModalItem.TabCard]: this.locators.tabCard,
      [WalletDepositModalItem.TabCrypto]: this.locators.tabCrypto,
      [WalletDepositModalItem.TabCashback]: this.locators.tabCashback,
      [WalletDepositModalItem.AmountInput]: this.locators.amountInput,
      [WalletDepositModalItem.AmountLabel]: this.locators.amountLabel,
      [WalletDepositModalItem.AmountMinMax]: this.locators.amountMinMax,
      [WalletDepositModalItem.BitcapitalButton]: this.locators.bitcapitalButton,
      [WalletDepositModalItem.TokenDropdown]: this.locators.tokenDropdown,
      [WalletDepositModalItem.TokenUSDT]: this.locators.tokenUSDT,
      [WalletDepositModalItem.TokenUSDC]: this.locators.tokenUSDC,
      [WalletDepositModalItem.NetworkDropdown]: this.locators.networkDropdown,
      [WalletDepositModalItem.NetworkTron]: this.locators.networkTron,
      [WalletDepositModalItem.NetworkEthereum]: this.locators.networkEthereum,
      [WalletDepositModalItem.NetworkPolygon]: this.locators.networkPolygon,
      [WalletDepositModalItem.NetworkBSC]: this.locators.networkBSC,
      [WalletDepositModalItem.NetworkTON]: this.locators.networkTON,
      [WalletDepositModalItem.CashbackInput]: this.locators.cashbackInput,
      [WalletDepositModalItem.CashbackBalance]: this.locators.cashbackBalance,
      [WalletDepositModalItem.SelectBonusButton]: this.locators.selectBonusButton,
      [WalletDepositModalItem.NextButton]: this.locators.nextButton,
      [WalletDepositModalItem.DepositButton]: this.locators.depositButton,
      [WalletDepositModalItem.DepositByCashbackButton]: this.locators.depositByCashbackButton,
    };

    return locatorMap[item]();
  }

  /**
   * Проверить видимость элемента
   */
  async isElementVisible(item: WalletDepositModalItem): Promise<boolean> {
    try {
      return await this.getLocator(item).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Кликнуть на элемент
   */
  async clickElement(item: WalletDepositModalItem): Promise<void> {
    await this.getLocator(item).click();
  }

  /**
   * @deprecated Используйте isLoaded()
   */
  get modal() {
    return {
      isVisible: () => this.isLoaded()
    };
  }

  // ========== ГРУППИРОВАННЫЕ МЕТОДЫ ==========

  /**
   * Группа методов для работы с балансом
   */
  balance = {
    getFiat: async (): Promise<string | null> => {
      return await this.getBalanceFiat();
    },
    
    getCrypto: async (): Promise<string | null> => {
      return await this.getBalanceCrypto();
    },
    
    openHistory: async (): Promise<void> => {
      await this.openHistory();
    },
  };

  /**
   * Группа методов для работы с табами
   */
  tabs = {
    clickCard: async (): Promise<void> => {
      await this.clickTabCard();
    },
    
    clickCrypto: async (): Promise<void> => {
      await this.clickTabCrypto();
    },
    
    clickCashback: async (): Promise<void> => {
      await this.clickTabCashback();
    },
    
    isCardActive: async (): Promise<boolean> => {
      return await this.isTabCardActive();
    },
    
    isCryptoActive: async (): Promise<boolean> => {
      return await this.isTabCryptoActive();
    },
  };

  /**
   * Группа методов для пополнения картой
   */
  card = {
    fillAmount: async (amount: string | number): Promise<void> => {
      await this.fillAmount(amount);
    },
    
    getAmount: async (): Promise<string> => {
      return await this.getAmount();
    },
    
    clearAmount: async (): Promise<void> => {
      await this.clearAmount();
    },
    
    clickBitcapital: async (): Promise<void> => {
      await this.clickBitcapital();
    },
    
    selectBonus: async (): Promise<void> => {
      await this.clickSelectBonus();
    },
    
    clickNext: async (): Promise<void> => {
      await this.clickNext();
    },
    
    deposit: async (amount: string | number, selectBonus: boolean = false): Promise<void> => {
      await this.depositByCard(amount, selectBonus);
    },
  };

  /**
   * Группа методов для пополнения криптой
   */
  crypto = {
    selectTokenUSDT: async (): Promise<void> => {
      await this.selectTokenUSDT();
    },
    
    selectTokenUSDC: async (): Promise<void> => {
      await this.selectTokenUSDC();
    },
    
    selectNetworkTron: async (): Promise<void> => {
      await this.selectNetworkTron();
    },
    
    selectNetworkEthereum: async (): Promise<void> => {
      await this.selectNetworkEthereum();
    },
    
    selectNetworkPolygon: async (): Promise<void> => {
      await this.selectNetworkPolygon();
    },
    
    selectNetworkBSC: async (): Promise<void> => {
      await this.selectNetworkBSC();
    },
    
    selectNetworkTON: async (): Promise<void> => {
      await this.selectNetworkTON();
    },
    
    deposit: async (token: 'USDT' | 'USDC', network: 'Tron' | 'Ethereum' | 'Polygon' | 'BSC' | 'TON'): Promise<void> => {
      await this.depositByCrypto(token, network);
    },
  };

  /**
   * Группа методов для пополнения кэшбэком
   */
  cashback = {
    fillAmount: async (amount: string | number): Promise<void> => {
      await this.fillCashbackAmount(amount);
    },
    
    getBalance: async (): Promise<string | null> => {
      return await this.getCashbackBalance();
    },
    
    deposit: async (amount: string | number): Promise<void> => {
      await this.depositByCashbackAmount(amount);
    },
  };
}

