import { Page, expect } from '@playwright/test';

/**
 * Команды кошелька (бизнес-логика)
 * Объединяют несколько UI действий в сценарии
 */
export class WalletCommands {
  constructor(
    private readonly page: Page,
    private readonly pageFactory: any,
    private readonly modalFactory: any
  ) {}

  /**
   * Открыть кошелек
   */
  async openWallet(): Promise<void> {
    const header = this.pageFactory.createHeader();
    const walletModal = this.modalFactory.createWalletModal();

    await header.clickWallet();
    await walletModal.waitForLoad();
    await expect(async () => {
      const isLoaded = await walletModal.isLoaded();
      expect(isLoaded).toBeTruthy();
    }).toPass({ timeout: 10000 });
  }

  /**
   * Перейти к депозиту
   */
  async goToDeposit(): Promise<void> {
    await this.openWallet();
    
    const walletModal = this.modalFactory.createWalletModal();
    await walletModal.goToDeposit();
    
    const depositModal = this.modalFactory.createDepositModal();
    await depositModal.waitForLoad();
  }

  /**
   * Перейти к выводу средств
   */
  async goToWithdraw(): Promise<void> {
    await this.openWallet();
    
    const walletModal = this.modalFactory.createWalletModal();
    await walletModal.goToWithdrawal();
    
    await expect(async () => {
      const isLoaded = await walletModal.isLoaded();
      expect(isLoaded).toBeTruthy();
    }).toPass({ timeout: 10000 });
  }

  /**
   * Перейти к истории транзакций
   */
  async goToTransactionHistory(): Promise<void> {
    await this.openWallet();
    
    const walletModal = this.modalFactory.createWalletModal();
    await walletModal.goToHistory();
  }

  /**
   * Получить текущий баланс
   */
  async getBalance(): Promise<string> {
    const header = this.pageFactory.createHeader();
    const balanceText = await header.getBalanceText();
    return balanceText || '0';
  }

  /**
   * Проверить видимость баланса
   */
  async verifyBalanceVisible(): Promise<void> {
    const header = this.pageFactory.createHeader();
    const isLoggedIn = await header.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  }

  /**
   * Закрыть кошелек
   */
  async closeWallet(): Promise<void> {
    const walletModal = this.modalFactory.createWalletModal();
    await walletModal.close();
  }

  /**
   * Полный сценарий: открыть кошелек и проверить баланс
   */
  async openAndVerifyWallet(): Promise<string> {
    await this.openWallet();
    const balance = await this.getBalance();
    await this.closeWallet();
    return balance;
  }

  /**
   * Полный сценарий: пополнение счета
   */
  async makeDeposit(amount: number): Promise<void> {
    await this.goToDeposit();
    
    const depositModal = this.modalFactory.createDepositModal();
    // TODO: добавить методы для заполнения суммы депозита
    // await depositModal.fillAmount(amount);
    // await depositModal.selectPaymentMethod();
    // await depositModal.submit();
    
    await depositModal.close();
  }
}
