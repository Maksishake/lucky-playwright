import { Page, expect } from '@playwright/test';
import { BaseModal } from '../../base/base-page-object';

/**
 * Page Object для модального окна кошелька
 */
export class WalletModal extends BaseModal {
  // ========== ЛОКАТОРЫ ==========
  private readonly locators = {
    modal: '(//div[@class="modal-content"])[1], [class*="wallet-modal"], #wallet-modal',
    depositButton: 'button:has-text("Депозит"), button:has-text("Deposit"), button:has-text("Поповнити")',
    withdrawButton: 'button:has-text("Вывод"), button:has-text("Withdraw"), button:has-text("Вивести")',
    historyButton: 'button:has-text("История"), button:has-text("History"), button:has-text("Історія")',
    closeButton: 'button[class*="close"], .modal-close, [aria-label="Close"]',
    balance: '.balance, [class*="balance"]',
  };

  // ========== ПРОВЕРКИ ЗАГРУЗКИ ==========

  async isLoaded(): Promise<boolean> {
    try {
      const modal = this.page.locator(this.locators.modal).first();
      return await modal.isVisible();
    } catch {
      return false;
    }
  }

  async waitForLoad(): Promise<void> {
    await expect(this.page.locator(this.locators.modal).first()).toBeVisible({ timeout: 10000 });
  }

  // ========== ПРОВЕРКИ МОДАЛЬНОГО ОКНА ==========

  async isOpen(): Promise<boolean> {
    try {
      return await this.page.locator(this.locators.modal).first().isVisible();
    } catch {
      return false;
    }
  }

  async open(): Promise<void> {
    // Логика открытия модального окна (обычно через sidebar)
    await this.waitForLoad();
  }

  async close(): Promise<void> {
    await this.page.locator(this.locators.closeButton).first().click();
    await expect(this.page.locator(this.locators.modal).first()).toBeHidden({ timeout: 5000 });
  }

  /**
   * Проверить, что модальное окно открыто
   */
  async expectOpen(): Promise<void> {
    await expect(this.page.locator(this.locators.modal).first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Проверить, что модальное окно видимо
   */
  async expectModalVisible(): Promise<void> {
    await this.expectOpen();
  }

  // ========== ДЕЙСТВИЯ С КНОПКАМИ ==========

  /**
   * Кликнуть на кнопку депозита
   */
  async depositClick(): Promise<void> {
    const depositButton = this.page.locator(this.locators.depositButton).first();
    await depositButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Кликнуть на кнопку вывода
   */
  async withdrawClick(): Promise<void> {
    const withdrawButton = this.page.locator(this.locators.withdrawButton).first();
    await withdrawButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Кликнуть на кнопку истории транзакций
   */
  async transactionHistoryClick(): Promise<void> {
    const historyButton = this.page.locator(this.locators.historyButton).first();
    await historyButton.click();
    await this.page.waitForTimeout(500);
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить баланс
   */
  async getBalance(): Promise<string | null> {
    try {
      return await this.page.locator(this.locators.balance).first().textContent();
    } catch {
      return null;
    }
  }

  /**
   * Проверить видимость баланса
   */
  async expectBalanceVisible(): Promise<void> {
    await expect(this.page.locator(this.locators.balance).first()).toBeVisible({ timeout: 5000 });
  }

  /**
   * Перейти к депозиту (алиас для depositClick)
   */
  async goToDeposit(): Promise<void> {
    await this.depositClick();
  }

  // ========== МЕТОДЫ ДЕПОЗИТА ==========

  /**
   * Выбрать фиатную валюту
   */
  async selectFiat(): Promise<void> {
    await this.page.locator('button:has-text("Fiat"), button:has-text("Фиат")').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать криптовалюту
   */
  async selectCrypto(): Promise<void> {
    await this.page.locator('button:has-text("Crypto"), button:has-text("Крипто")').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Открыть выбор валюты
   */
  async openCurrencySelect(): Promise<void> {
    await this.page.locator('[class*="currency-select"], select[name="currency"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать RUB
   */
  async selectRUB(): Promise<void> {
    await this.page.locator('option:has-text("RUB"), li:has-text("RUB")').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать метод P2P
   */
  async selectP2PMethod(): Promise<void> {
    await this.page.locator('button:has-text("P2P"), [data-method="p2p"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Ввести сумму
   */
  async enterAmount(amount: string): Promise<void> {
    await this.page.locator('input[name="amount"], input[placeholder*="Сумма"]').fill(amount);
  }

  /**
   * Выбрать USDT токен
   */
  async selectUSDTToken(): Promise<void> {
    await this.page.locator('button:has-text("USDT"), [data-token="usdt"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать сеть Tron
   */
  async selectTronNetwork(): Promise<void> {
    await this.page.locator('button:has-text("TRON"), button:has-text("TRC20")').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Ввести промокод
   */
  async enterPromocode(code: string): Promise<void> {
    await this.page.locator('input[name="promo"], input[placeholder*="Промокод"]').fill(code);
  }

  /**
   * Применить промокод
   */
  async applyPromocode(): Promise<void> {
    await this.page.locator('button:has-text("Применить"), button:has-text("Apply")').click();
    await this.page.waitForTimeout(500);
  }

  // ========== ПРОВЕРКИ ДЕПОЗИТА ==========

  /**
   * Проверить ошибку минимальной суммы
   */
  async expectMinimumAmountError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("Минимальная"), .error:has-text("Minimum")')).toBeVisible();
  }

  /**
   * Проверить ошибку максимальной суммы
   */
  async expectMaximumAmountError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("Максимальная"), .error:has-text("Maximum")')).toBeVisible();
  }

  /**
   * Проверить ошибку невалидной суммы
   */
  async expectInvalidAmountError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("Неверная"), .error:has-text("Invalid")')).toBeVisible();
  }

  /**
   * Проверить видимость адреса депозита
   */
  async expectDepositAddressVisible(): Promise<void> {
    await expect(this.page.locator('[class*="deposit-address"], .address-field')).toBeVisible();
  }

  /**
   * Проверить видимость QR кода
   */
  async expectQRCodeVisible(): Promise<void> {
    await expect(this.page.locator('[class*="qr-code"], canvas, img[alt*="QR"]')).toBeVisible();
  }

  /**
   * Проверить видимость кнопки копирования
   */
  async expectCopyButtonVisible(): Promise<void> {
    await expect(this.page.locator('button:has-text("Копировать"), button:has-text("Copy")')).toBeVisible();
  }

  /**
   * Получить адрес депозита
   */
  async getDepositAddress(): Promise<string | null> {
    try {
      return await this.page.locator('[class*="deposit-address"], .address-field').textContent();
    } catch {
      return null;
    }
  }

  /**
   * Проверить применение промокода
   */
  async expectPromoCodeApplied(): Promise<void> {
    await expect(this.page.locator('.success:has-text("Промокод"), .success:has-text("Promo")')).toBeVisible();
  }

  // ========== ПРОВЕРКИ ТАБОВ ==========

  /**
   * Проверить видимость таба депозита
   */
  async expectDepositTabVisible(): Promise<void> {
    await expect(this.page.locator('[data-tab="deposit"], .tab-deposit, button:has-text("Депозит")')).toBeVisible();
  }

  /**
   * Проверить видимость таба вывода
   */
  async expectWithdrawTabVisible(): Promise<void> {
    await expect(this.page.locator('[data-tab="withdraw"], .tab-withdraw, button:has-text("Вывод")')).toBeVisible();
  }

  /**
   * Проверить видимость таба истории
   */
  async expectTransactionHistoryTabVisible(): Promise<void> {
    await expect(this.page.locator('[data-tab="history"], .tab-history, button:has-text("История")')).toBeVisible();
  }

  // ========== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Перейти к выводу средств (алиас для withdrawClick)
   */
  async goToWithdrawal(): Promise<void> {
    await this.withdrawClick();
  }

  /**
   * Обновить баланс
   */
  async refreshBalance(): Promise<void> {
    await this.page.locator('button:has-text("Обновить"), button[class*="refresh"], .refresh-button').first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Проверить, что модальное окно закрыто
   */
  async expectClosed(): Promise<void> {
    await expect(this.page.locator(this.locators.modal).first()).toBeHidden({ timeout: 5000 });
  }

  /**
   * Выбрать предустановленную сумму по индексу
   */
  async selectAmountRadio(index: number): Promise<void> {
    await this.page.locator(`#radio-item-${index}, input[type="radio"]:nth-of-type(${index})`).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Проверить ошибку промокода
   */
  async expectPromoCodeError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("Промокод"), .error:has-text("Promo"), .promo-error')).toBeVisible();
  }

  /**
   * Выбрать BTC токен
   */
  async selectBTCToken(): Promise<void> {
    await this.page.locator('button:has-text("BTC"), [data-token="btc"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать сеть Bitcoin
   */
  async selectBitcoinNetwork(): Promise<void> {
    await this.page.locator('button:has-text("Bitcoin"), button:has-text("BTC Network")').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать невалидный токен
   */
  async selectInvalidToken(): Promise<void> {
    await this.page.locator('button:has-text("INVALID"), [data-token="invalid"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Выбрать невалидную сеть
   */
  async selectInvalidNetwork(): Promise<void> {
    await this.page.locator('button:has-text("INVALID_NETWORK"), [data-network="invalid"]').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Проверить ошибку невалидного токена
   */
  async expectInvalidTokenError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("токен"), .error:has-text("token"), .token-error')).toBeVisible();
  }

  /**
   * Проверить ошибку невалидной сети
   */
  async expectInvalidNetworkError(): Promise<void> {
    await expect(this.page.locator('.error:has-text("сеть"), .error:has-text("network"), .network-error')).toBeVisible();
  }
}
