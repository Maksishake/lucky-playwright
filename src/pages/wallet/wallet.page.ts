/**
 * Wallet Page
 * Page Object для страницы кошелька
 * Все локаторы хранятся ВНУТРИ страницы как getter methods
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { Input } from '../../components/atoms/input';
import { Button } from '../../components/atoms/button';
import { logger } from '../../utils/core/logger';
import { Waiter } from '../../utils/core/waiter';

export class WalletPage extends BasePage {
  protected url = '/wallet';
  protected pageName = 'Wallet Page';

  // Components
  public depositAmountInput: Input;
  public withdrawalAmountInput: Input;
  private depositSubmitButton: Button;
  private withdrawalSubmitButton: Button;

  constructor(page: Page) {
    super(page);
    
    // Initialize components
    this.depositAmountInput = new Input(page, 'input[name="amount"], input[placeholder*="Сума"]', 'Deposit Amount');
    this.withdrawalAmountInput = new Input(page, 'input[name="withdrawal_amount"]', 'Withdrawal Amount');
    this.depositSubmitButton = new Button(page, 'button[type="submit"], button:has-text("Поповнити")', 'Deposit Submit');
    this.withdrawalSubmitButton = new Button(page, 'button[type="submit"], button:has-text("Вивести")', 'Withdrawal Submit');
  }

  // ========== LOCATOR GETTERS ==========

  // Main wallet elements
  get walletModal(): Locator {
    return this.page.locator('[data-testid="wallet-modal"], .modal-wallet, #modal-wallet-main');
  }

  get walletButton(): Locator {
    return this.page.locator('[data-testid="wallet-btn"], button[onclick*="modal-wallet-main"]');
  }

  get walletBalance(): Locator {
    return this.page.locator('.wallet-balance, [data-testid="balance"]');
  }

  get walletCurrency(): Locator {
    return this.page.locator('.wallet-currency, [data-testid="currency"]');
  }

  get closeButton(): Locator {
    return this.page.locator('.modal-close, button[aria-label="Close"]');
  }

  // Tabs
  get depositTab(): Locator {
    return this.page.locator('[data-tab="deposit"], button:has-text("Поповнення")');
  }

  get withdrawalTab(): Locator {
    return this.page.locator('[data-tab="withdrawal"], button:has-text("Виведення")');
  }

  get historyTab(): Locator {
    return this.page.locator('[data-tab="history"], button:has-text("Історія")');
  }

  // Deposit elements
  get depositCurrency(): Locator {
    return this.page.locator('select[name="currency"], .currency-selector');
  }

  get depositMethod(): Locator {
    return this.page.locator('[data-testid="payment-method"], .payment-methods');
  }

  get depositPromoCode(): Locator {
    return this.page.locator('input[name="promo_code"], input[placeholder*="Промокод"]');
  }

  get depositMinAmount(): Locator {
    return this.page.locator('[data-testid="min-amount"], .min-amount-info');
  }

  get depositMaxAmount(): Locator {
    return this.page.locator('[data-testid="max-amount"], .max-amount-info');
  }

  // Payment Methods
  get paymentP2P(): Locator {
    return this.page.locator('[data-method="p2p"], button:has-text("P2P")');
  }

  get paymentCard(): Locator {
    return this.page.locator('[data-method="card"], button:has-text("Картка")');
  }

  get paymentCrypto(): Locator {
    return this.page.locator('[data-method="crypto"], button:has-text("Крипто")');
  }

  get paymentBTC(): Locator {
    return this.page.locator('[data-currency="BTC"], button:has-text("Bitcoin")');
  }

  get paymentETH(): Locator {
    return this.page.locator('[data-currency="ETH"], button:has-text("Ethereum")');
  }

  get paymentUSDT(): Locator {
    return this.page.locator('[data-currency="USDT"], button:has-text("Tether")');
  }

  // Withdrawal elements
  get withdrawalMethod(): Locator {
    return this.page.locator('[data-testid="withdrawal-method"]');
  }

  get withdrawalAddress(): Locator {
    return this.page.locator('input[name="address"], input[placeholder*="Адреса"]');
  }

  get withdrawalFee(): Locator {
    return this.page.locator('[data-testid="withdrawal-fee"], .withdrawal-fee');
  }

  get withdrawalAvailable(): Locator {
    return this.page.locator('[data-testid="available-balance"], .available-balance');
  }

  // Transaction History
  get transactionList(): Locator {
    return this.page.locator('[data-testid="transaction-list"], .transaction-history');
  }

  get transactionItems(): Locator {
    return this.page.locator('.transaction-item, [data-testid="transaction"]');
  }

  // Messages
  get successMessage(): Locator {
    return this.page.locator('.success-message, [data-testid="wallet-success"]');
  }

  get errorMessage(): Locator {
    return this.page.locator('.error-message, [data-testid="wallet-error"]');
  }

  get warningMessage(): Locator {
    return this.page.locator('.warning-message, [data-testid="wallet-warning"]');
  }

  // ========== PAGE ACTIONS ==========

  /**
   * Open wallet modal
   */
  async open(): Promise<void> {
    logger.step('Opening wallet modal');
    await this.walletButton.click();
    await this.waitForLoad();
  }

  /**
   * Check if wallet modal is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.walletModal.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  /**
   * Wait for wallet modal to load
   * Override parent method to wait for modal first
   */
  async waitForLoad(timeout?: number): Promise<void> {
    logger.debug(`Waiting for ${this.constructor.name} to load`);
    
    // Wait for modal to appear
    await this.walletModal.waitFor({ state: 'visible', timeout });
    
    // Then wait for network and loader
    await this.page.waitForLoadState('networkidle', { timeout });
    await Waiter.waitForLoaderToDisappear(this.page, timeout);
    
    logger.success(`${this.constructor.name} loaded`);
  }

  /**
   * Get current balance
   */
  async getBalance(): Promise<number> {
    logger.step('Getting wallet balance');
    const balanceText = await this.walletBalance.textContent();
    const balance = parseFloat(balanceText?.replace(/[^\d.]/g, '') || '0');
    logger.success(`Current balance: ${balance}`);
    return balance;
  }

  /**
   * Switch to deposit tab
   */
  async switchToDepositTab(): Promise<void> {
    logger.step('Switching to deposit tab');
    await this.depositTab.click();
  }

  /**
   * Switch to withdrawal tab
   */
  async switchToWithdrawalTab(): Promise<void> {
    logger.step('Switching to withdrawal tab');
    await this.withdrawalTab.click();
  }

  /**
   * Switch to history tab
   */
  async switchToHistoryTab(): Promise<void> {
    logger.step('Switching to history tab');
    await this.historyTab.click();
  }

  /**
   * Make a deposit
   */
  async deposit(amount: number, method: string = 'p2p', promoCode?: string): Promise<void> {
    logger.step(`Making deposit: ${amount} via ${method}`);
    
    await this.switchToDepositTab();
    await this.depositAmountInput.fill(amount.toString());
    
    if (method === 'p2p') {
      await this.paymentP2P.click();
    } else if (method === 'card') {
      await this.paymentCard.click();
    } else if (method === 'crypto') {
      await this.paymentCrypto.click();
    }
    
    if (promoCode) {
      await this.depositPromoCode.fill(promoCode);
    }
    
    await this.depositSubmitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    logger.success(`Deposit of ${amount} initiated`);
  }

  /**
   * Make a withdrawal
   */
  async withdraw(amount: number, address: string): Promise<void> {
    logger.step(`Making withdrawal: ${amount} to ${address}`);
    
    await this.switchToWithdrawalTab();
    await this.withdrawalAmountInput.fill(amount.toString());
    
    const addressLocator = 'input[name="address"], input[placeholder*="Адреса"]';
    const addressInput = new Input(this.page, addressLocator, 'Withdrawal Address');
    await addressInput.fill(address);
    
    await this.withdrawalSubmitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    logger.success(`Withdrawal of ${amount} initiated`);
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(): Promise<any[]> {
    logger.step('Getting transaction history');
    await this.switchToHistoryTab();
    
    const transactions = await this.transactionItems.all();
    logger.success(`Found ${transactions.length} transactions`);
    
    return transactions;
  }

  /**
   * Close wallet modal
   */
  async close(): Promise<void> {
    logger.step('Closing wallet modal');
    await this.closeButton.click();
  }

  /**
   * Check if error message is visible
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}

