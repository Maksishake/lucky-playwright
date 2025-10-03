import { Page } from '@playwright/test';
import { PageFactory } from './page-factory';
import { ModalFactory } from './modal-factory';

// Business Commands
import { AuthCommands } from '../auth/auth.commands';
import { RegistrationCommands } from '../auth/registration.commands';
import { WalletCommands } from '../wallet/wallet.commands';
import { ProfileCommands } from '../profile/profile.commands';
import { GamesCommands } from '../games/games.commands';
import { NavigationCommands } from '../navigation/navigation.commands';

/**
 * Главная фабрика для создания бизнес-команд
 */
export class BusinessFactory {
  private readonly pageFactory: PageFactory;
  private readonly modalFactory: ModalFactory;

  constructor(private readonly page: Page) {
    this.pageFactory = new PageFactory(page);
    this.modalFactory = new ModalFactory(page);
  }

  // ========== AUTH COMMANDS ==========

  createAuthCommands(): AuthCommands {
    return new AuthCommands(this.page, this.pageFactory, this.modalFactory);
  }

  createRegistrationCommands(): RegistrationCommands {
    return new RegistrationCommands(this.page, this.pageFactory, this.modalFactory);
  }

  // ========== WALLET COMMANDS ==========

  createWalletCommands(): WalletCommands {
    return new WalletCommands(this.page, this.pageFactory, this.modalFactory);
  }

  // ========== PROFILE COMMANDS ==========

  createProfileCommands(): ProfileCommands {
    return new ProfileCommands(this.page, this.pageFactory, this.modalFactory);
  }

  // ========== GAMES COMMANDS ==========

  createGamesCommands(): GamesCommands {
    return new GamesCommands(this.page, this.pageFactory, null); // widgetFactory будет позже
  }

  // ========== NAVIGATION COMMANDS ==========

  createNavigationCommands(): NavigationCommands {
    return new NavigationCommands(this.page, this.pageFactory);
  }

  // ========== ГРУППЫ КОМАНД ==========

  /**
   * Создать все команды авторизации
   */
  createAuthGroup() {
    return {
      auth: this.createAuthCommands(),
      registration: this.createRegistrationCommands(),
    };
  }

  /**
   * Создать все команды кошелька
   */
  createWalletGroup() {
    return {
      wallet: this.createWalletCommands(),
    };
  }

  /**
   * Создать все команды для smoke тестов
   */
  createSmokeGroup() {
    return {
      auth: this.createAuthCommands(),
      navigation: this.createNavigationCommands(),
      profile: this.createProfileCommands(),
      wallet: this.createWalletCommands(),
    };
  }

  /**
   * Создать все команды для regression тестов
   */
  createRegressionGroup() {
    return {
      auth: this.createAuthCommands(),
      navigation: this.createNavigationCommands(),
      profile: this.createProfileCommands(),
      wallet: this.createWalletCommands(),
      games: this.createGamesCommands(),
    };
  }

  /**
   * Создать все доступные команды
   */
  createAllCommands() {
    return {
      auth: this.createAuthCommands(),
      registration: this.createRegistrationCommands(),
      wallet: this.createWalletCommands(),
      profile: this.createProfileCommands(),
      games: this.createGamesCommands(),
      navigation: this.createNavigationCommands(),
    };
  }

  // ========== ДОСТУП К ФАБРИКАМ ==========

  getPageFactory(): PageFactory {
    return this.pageFactory;
  }

  getModalFactory(): ModalFactory {
    return this.modalFactory;
  }

  getPage(): Page {
    return this.page;
  }
}
