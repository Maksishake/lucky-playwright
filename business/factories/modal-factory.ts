import { Page } from '@playwright/test';

// Auth Modals
import { LoginModal } from '../../pages/modals/auth/login.modal';
import { RegistrationModal } from '../../pages/modals/auth/registration.modal';

// Wallet Modals
import { WalletModal } from '../../pages/modals/wallet/wallet.modal';
import { WalletDepositModal } from '../../pages/modals/wallet/deposit.modal';

// Profile Modals
import { UserProfileModal } from '../../pages/modals/profile/user-profile.modal';

// Other Modals
import { BitcapitalModal } from '../../pages/modals/other/bitcapital.modal';

/**
 * Фабрика для создания модальных окон
 */
export class ModalFactory {
  constructor(private readonly page: Page) {}

  // ========== AUTH MODALS ==========

  createLoginModal(): LoginModal {
    return new LoginModal(this.page);
  }

  createRegistrationModal(): RegistrationModal {
    return new RegistrationModal(this.page);
  }

  // ========== WALLET MODALS ==========

  createWalletModal(): WalletModal {
    return new WalletModal(this.page);
  }

  createDepositModal(): WalletDepositModal {
    return new WalletDepositModal(this.page);
  }

  // Алиас для обратной совместимости
  createWalletDepositModal(): WalletDepositModal {
    return this.createDepositModal();
  }

  // ========== PROFILE MODALS ==========

  createUserProfileModal(): UserProfileModal {
    return new UserProfileModal(this.page);
  }

  // ========== OTHER MODALS ==========

  createBitcapitalModal(): BitcapitalModal {
    return new BitcapitalModal(this.page);
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Возвращает экземпляр Page
   */
  getPage(): Page {
    return this.page;
  }
}
