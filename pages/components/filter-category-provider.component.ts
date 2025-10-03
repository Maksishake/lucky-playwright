import { Page, Locator, expect } from "@playwright/test";
import { BasePageObject } from "../base/base-page-object";

/**
 * Категории игр
 */
export enum CategoryItem {
  AllCategory = "all",
  PopularCategory = "popular",
  NewCategory = "new",
  SlotsCategory = "slots",
  ArcadeCategory = "arcade",
  BaccaratCategory = "baccarat",
  BingoCategory = "bingo",
  BlackjackCategory = "blackjack",
  BuyBonusCategory = "buy-bonus",
  CrashGameCategory = "crash-game",
  DiceCategory = "dice",
  FishingShootingCategory = "fishing-shooting",
  FreeBonusCategory = "free-bonus",
  JackpotCategory = "jackpot",
  LiveCasinoCategory = "live-casino",
  LotteryCategory = "lottery",
  MinesCategory = "mines",
  OtherCategory = "other",
  PlinkoCategory = "plinko",
  PokerCategory = "poker",
  ProgressionFeatureCategory = "progression-feature",
  RouletteCategory = "roulette",
  ScratchCardsCategory = "scratch-cards",
  TableGamesCategory = "table-games",
  ShowGamesCategory = "show-games",
  GrowBonusCategory = "grow-bonus",
}

/**
 * Класс для работы с категориями игр
 */
export class CategorySection {
  private readonly page: Page;
  
  // Маппинг категорий на текст для поиска
  private readonly categoryText: Record<CategoryItem, string> = {
    [CategoryItem.AllCategory]: "Усі",
    [CategoryItem.PopularCategory]: "Popular",
    [CategoryItem.NewCategory]: "Нові",
    [CategoryItem.SlotsCategory]: "Слоти",
    [CategoryItem.BuyBonusCategory]: "Купівля бонусу",
    [CategoryItem.LiveCasinoCategory]: "Жива каса",
    [CategoryItem.ShowGamesCategory]: "Show",
    [CategoryItem.ArcadeCategory]: "Arcade",
    [CategoryItem.BaccaratCategory]: "Baccarat",
    [CategoryItem.BingoCategory]: "Bingo",
    [CategoryItem.BlackjackCategory]: "Blackjack",
    [CategoryItem.CrashGameCategory]: "Crash",
    [CategoryItem.DiceCategory]: "Dice",
    [CategoryItem.FishingShootingCategory]: "Fishing",
    [CategoryItem.FreeBonusCategory]: "Free Bonus",
    [CategoryItem.JackpotCategory]: "Jackpot",
    [CategoryItem.LotteryCategory]: "Lottery",
    [CategoryItem.MinesCategory]: "Mines",
    [CategoryItem.OtherCategory]: "Other",
    [CategoryItem.PlinkoCategory]: "Plinko",
    [CategoryItem.PokerCategory]: "Poker",
    [CategoryItem.ProgressionFeatureCategory]: "Progression",
    [CategoryItem.RouletteCategory]: "Roulette",
    [CategoryItem.ScratchCardsCategory]: "Scratch",
    [CategoryItem.TableGamesCategory]: "Table Games",
    [CategoryItem.GrowBonusCategory]: "Grow Bonus",
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Получить локатор категории
   * Использует более надежный CSS селектор вместо XPath
   */
  private getCategoryLocator(item: CategoryItem): Locator {
    const text = this.categoryText[item];
    return this.page.locator(`sidebar li:has-text("${text}")`).first();
  }

  /**
   * Кликнуть на категорию
   */
  public async categoryClick(item: CategoryItem): Promise<void> {
    await this.getCategoryLocator(item).click();
    await this.page.waitForTimeout(500); // Ждем загрузки игр
  }

  /**
   * Проверить видимость категории
   */
  public async isVisibleCategory(item: CategoryItem): Promise<boolean> {
    return await this.getCategoryLocator(item).isVisible().catch(() => false);
  }

  /**
   * Получить все доступные категории
   */
  public async getAllVisibleCategories(): Promise<CategoryItem[]> {
    const visible: CategoryItem[] = [];
    for (const category of Object.values(CategoryItem)) {
      if (await this.isVisibleCategory(category)) {
        visible.push(category);
      }
    }
    return visible;
  }

  /**
   * Проверить, что категория активна
   */
  public async isCategoryActive(item: CategoryItem): Promise<boolean> {
    const locator = this.getCategoryLocator(item);
    const classList = await locator.getAttribute('class');
    return classList?.includes('active') || false;
  }
}

/**
 * Провайдеры игр
 */
export enum ProviderItem {
  MainProvider = "providers",
  AmigoGamingProvider = "amigo-gaming",
  ApolloGamesProvider = "apollo-games",
  ApparatProvider = "apparat",
  AvatarUXProvider = "avatar-ux",
  AviatrixProvider = "aviatrix",
  BarbaraBangProvider = "barbara-bang",
  BelatraProvider = "belatra",
  BeterLiveProvider = "beter-live",
  BGamingProvider = "bgaming",
  BigTimeGamingProvider = "big-time-gaming",
  BlueprintProvider = "blueprint",
  BoldplayProvider = "boldplay",
  CaletaProvider = "caleta",
  ChilliGamesProvider = "chilli-games",
  CTGamingProvider = "ct-gaming",
  CTInteractiveProvider = "ct-interactive",
  EndorphinaProvider = "endorphina",
  EspressogamesProvider = "espressogames",
  EurasianGamingSlotsProvider = "eurasian-gaming-slots",
  EvoplayProvider = "evoplay",
  ExcellentReelProvider = "excellent-reel",
  EzugiProvider = "ezugi",
  FugasoProvider = "fugaso",
  GamzixProvider = "gamzix",
  HacksawGamingProvider = "hacksaw-gaming",
  HoGamingProvider = "hogaming",
  HolleGamesStandardProvider = "holle-games-standard",
  IgrosoftProvider = "igrosoft",
  IronDogStudioProvider = "iron-dog-studio",
  KAProvider = "ka",
  KalambaProvider = "kalamba",
  MascotProvider = "mascot",
  MPlayProvider = "mplay",
  NetentProvider = "netent",
  NetGameProvider = "net-game",
  NoLimitCityProvider = "no-limit-city",
  NovomaticProvider = "novomatic",
  NucleusProvider = "nucleus",
  OnlyPlayProvider = "only-play",
  PGSoftProvider = "pg-soft",
  PlatipusProvider = "platipus",
  PlayNGOPlaynGOProvider = "play-n-go",
  PlaysonProvider = "playson",
  PlaysonPremiumProvider = "playson-premium",
  PragmaticPlayProvider = "pragmatic-play",
  PragmaticPlayLiveProvider = "pragmatic-play-live",
  RedTigerGamingProvider = "red-tiger-gaming",
  RivalGamesProvider = "rival-games",
  RTGSLOTSProvider = "rtg-slots",
  SlotopiaProvider = "slotopia",
  SpadegamingProvider = "spadegaming",
  SSGProvider = "ssg",
  SuperlottoTVProvider = "superlotto-tv",
  TomhornProvider = "tomhorn",
  TurbogamesProvider = "turbogames",
  VivogamingProvider = "vivogaming",
  VoltEntertainmentProvider = "volt-entertainment",
  WazdanProvider = "wazdan",
  XProgamingProvider = "xprogaming",
  ZeusPlayProvider = "zeus-play",
}

/**
 * Класс для работы с провайдерами игр
 */
export class ProviderSection {
  private readonly page: Page;
  
  // Маппинг провайдеров на отображаемые названия
  private readonly providerNames: Record<ProviderItem, string> = {
    [ProviderItem.MainProvider]: "Провайдери", // Секция провайдеров
    [ProviderItem.AmigoGamingProvider]: "Amigo Gaming",
    [ProviderItem.ApolloGamesProvider]: "Apollo Games",
    [ProviderItem.ApparatProvider]: "Apparat",
    [ProviderItem.AvatarUXProvider]: "AvatarUX",
    [ProviderItem.AviatrixProvider]: "Aviatrix",
    [ProviderItem.BarbaraBangProvider]: "Barbara Bang",
    [ProviderItem.BelatraProvider]: "Belatra",
    [ProviderItem.BeterLiveProvider]: "Beter Live",
    [ProviderItem.BGamingProvider]: "BGaming",
    [ProviderItem.BigTimeGamingProvider]: "Big Time Gaming",
    [ProviderItem.BlueprintProvider]: "Blueprint",
    [ProviderItem.BoldplayProvider]: "Boldplay",
    [ProviderItem.CaletaProvider]: "Caleta",
    [ProviderItem.ChilliGamesProvider]: "Chilli Games",
    [ProviderItem.CTGamingProvider]: "CT Gaming",
    [ProviderItem.CTInteractiveProvider]: "CT Interactive",
    [ProviderItem.EndorphinaProvider]: "Endorphina",
    [ProviderItem.EspressogamesProvider]: "Espresso Games",
    [ProviderItem.EurasianGamingSlotsProvider]: "Eurasian Gaming",
    [ProviderItem.EvoplayProvider]: "Evoplay",
    [ProviderItem.ExcellentReelProvider]: "Excellent Reel",
    [ProviderItem.EzugiProvider]: "Ezugi",
    [ProviderItem.FugasoProvider]: "Fugaso",
    [ProviderItem.GamzixProvider]: "Gamzix",
    [ProviderItem.HacksawGamingProvider]: "Hacksaw Gaming",
    [ProviderItem.HoGamingProvider]: "HoGaming",
    [ProviderItem.HolleGamesStandardProvider]: "Holle Games",
    [ProviderItem.IgrosoftProvider]: "Igrosoft",
    [ProviderItem.IronDogStudioProvider]: "Iron Dog Studio",
    [ProviderItem.KAProvider]: "KA Gaming",
    [ProviderItem.KalambaProvider]: "Kalamba",
    [ProviderItem.MascotProvider]: "Mascot",
    [ProviderItem.MPlayProvider]: "MPlay",
    [ProviderItem.NetentProvider]: "NetEnt",
    [ProviderItem.NetGameProvider]: "NetGame",
    [ProviderItem.NoLimitCityProvider]: "Nolimit City",
    [ProviderItem.NovomaticProvider]: "Novomatic",
    [ProviderItem.NucleusProvider]: "Nucleus",
    [ProviderItem.OnlyPlayProvider]: "OnlyPlay",
    [ProviderItem.PGSoftProvider]: "PG Soft",
    [ProviderItem.PlatipusProvider]: "Platipus",
    [ProviderItem.PlayNGOPlaynGOProvider]: "Play'n GO",
    [ProviderItem.PlaysonProvider]: "Playson",
    [ProviderItem.PlaysonPremiumProvider]: "Playson Premium",
    [ProviderItem.PragmaticPlayProvider]: "Pragmatic Play",
    [ProviderItem.PragmaticPlayLiveProvider]: "Pragmatic Play Live",
    [ProviderItem.RedTigerGamingProvider]: "Red Tiger",
    [ProviderItem.RivalGamesProvider]: "Rival",
    [ProviderItem.RTGSLOTSProvider]: "RTG",
    [ProviderItem.SlotopiaProvider]: "Slotopia",
    [ProviderItem.SpadegamingProvider]: "Spadegaming",
    [ProviderItem.SSGProvider]: "SSG",
    [ProviderItem.SuperlottoTVProvider]: "Superlotto",
    [ProviderItem.TomhornProvider]: "Tomhorn",
    [ProviderItem.TurbogamesProvider]: "Turbo Games",
    [ProviderItem.VivogamingProvider]: "Vivo Gaming",
    [ProviderItem.VoltEntertainmentProvider]: "Volt",
    [ProviderItem.WazdanProvider]: "Wazdan",
    [ProviderItem.XProgamingProvider]: "XPro Gaming",
    [ProviderItem.ZeusPlayProvider]: "Zeus Play",
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Получить локатор секции провайдеров
   */
  private getProviderSection(): Locator {
    return this.page.locator('.providers-section, [class*="provider"]').first();
  }

  /**
   * Получить локатор провайдера
   * Использует более надежный подход через текст
   */
  private getProviderLocator(item: ProviderItem): Locator {
    if (item === ProviderItem.MainProvider) {
      return this.getProviderSection();
    }
    
    const providerName = this.providerNames[item];
    // Ищем провайдера по тексту в sidebar или в списке провайдеров
    return this.page.locator(`sidebar li:has-text("${providerName}"), .provider-item:has-text("${providerName}")`).first();
  }

  /**
   * Кликнуть на провайдера
   */
  public async providerClick(item: ProviderItem): Promise<void> {
    await this.getProviderLocator(item).click();
    await this.page.waitForTimeout(500); // Ждем загрузки игр
  }

  /**
   * Проверить видимость провайдера
   */
  public async isProviderVisible(item: ProviderItem): Promise<boolean> {
    return await this.getProviderLocator(item).isVisible().catch(() => false);
  }

  /**
   * Проверить видимость секции провайдеров
   */
  public async expectProviderSectionVisible(): Promise<void> {
    await expect(this.getProviderSection()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Проверить все провайдеры (кликнуть по каждому)
   */
  public async checkAllProviders(): Promise<void> {
    const allProviders = Object.values(ProviderItem).filter(p => p !== ProviderItem.MainProvider);
    
    for (const provider of allProviders) {
      if (await this.isProviderVisible(provider)) {
        await this.providerClick(provider);
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * Проверить одного провайдера с открытием первой игры
   */
  public async oneProviderCheck(item: ProviderItem): Promise<void> {
    // Открываем секцию провайдеров
    if (item !== ProviderItem.MainProvider) {
      await this.getProviderSection().click();
    }
    
    // Ждем и кликаем на провайдера
    await expect(this.getProviderLocator(item)).toBeVisible({ timeout: 5000 });
    await this.providerClick(item);
    
    // Ждем появления игр и кликаем на первую
    const firstGame = this.page.locator('.game-card, [class*="game"]').first();
    await expect(firstGame).toBeVisible({ timeout: 5000 });
    
    // Кликаем на кнопку запуска игры
    const playButton = firstGame.locator('button, .play-btn').first();
    await playButton.click();
  }

  /**
   * Получить всех видимых провайдеров
   */
  public async getAllVisibleProviders(): Promise<ProviderItem[]> {
    const visible: ProviderItem[] = [];
    for (const provider of Object.values(ProviderItem)) {
      if (provider !== ProviderItem.MainProvider && await this.isProviderVisible(provider)) {
        visible.push(provider);
      }
    }
    return visible;
  }

  /**
   * Проверить, что провайдер активен
   */
  public async isProviderActive(item: ProviderItem): Promise<boolean> {
    const locator = this.getProviderLocator(item);
    const classList = await locator.getAttribute('class');
    return classList?.includes('active') || false;
  }
}

/**
 * Основной класс для работы с фильтрами и категориями
 * Объединяет работу с категориями и провайдерами
 */
export class FilterCategoryProvider extends BasePageObject {
  public readonly category: CategorySection;
  public readonly provider: ProviderSection;

  constructor(page: Page) {
    super(page);
    this.category = new CategorySection(page);
    this.provider = new ProviderSection(page);
  }

  async isLoaded(): Promise<boolean> {
    return true; // Фильтры всегда доступны на странице
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ========== МЕТОДЫ ДЛЯ ПРОВАЙДЕРОВ ==========

  /**
   * Проверить видимость секции провайдеров
   */
  async expectProviderSectionVisible(): Promise<void> {
    await this.provider.expectProviderSectionVisible();
  }

  /**
   * Проверить одного провайдера
   */
  async oneProviderCheck(item: ProviderItem): Promise<void> {
    await this.provider.oneProviderCheck(item);
  }

  /**
   * Проверить все провайдеры
   */
  async checkAllProviders(): Promise<void> {
    await this.provider.checkAllProviders();
  }

  /**
   * Кликнуть на провайдера
   */
  async clickProvider(item: ProviderItem): Promise<void> {
    await this.provider.providerClick(item);
  }

  /**
   * Проверить видимость провайдера
   */
  async isProviderVisible(item: ProviderItem): Promise<boolean> {
    return await this.provider.isProviderVisible(item);
  }

  // ========== МЕТОДЫ ДЛЯ КАТЕГОРИЙ ==========

  /**
   * Кликнуть на категорию
   */
  async clickCategory(item: CategoryItem): Promise<void> {
    await this.category.categoryClick(item);
  }

  /**
   * Проверить видимость категории
   */
  async isCategoryVisible(item: CategoryItem): Promise<boolean> {
    return await this.category.isVisibleCategory(item);
  }

  /**
   * Проверить, что категория активна
   */
  async isCategoryActive(item: CategoryItem): Promise<boolean> {
    return await this.category.isCategoryActive(item);
  }

  // ========== КОМПЛЕКСНЫЕ МЕТОДЫ ==========

  /**
   * Получить статистику фильтров
   */
  async getFiltersStats(): Promise<{
    categories: {
      total: number;
      visible: CategoryItem[];
    };
    providers: {
      total: number;
      visible: ProviderItem[];
    };
  }> {
    return {
      categories: {
        total: Object.keys(CategoryItem).length,
        visible: await this.category.getAllVisibleCategories(),
      },
      providers: {
        total: Object.keys(ProviderItem).length - 1, // Минус MainProvider
        visible: await this.provider.getAllVisibleProviders(),
      },
    };
  }

  /**
   * Протестировать фильтрацию: категория + провайдер
   */
  async testCategoryAndProvider(category: CategoryItem, provider: ProviderItem): Promise<void> {
    // Выбираем категорию
    await this.clickCategory(category);
    await this.page.waitForTimeout(1000);
    
    // Выбираем провайдера
    await this.clickProvider(provider);
    await this.page.waitForTimeout(1000);
    
    // Проверяем, что есть игры
    const gamesGrid = this.page.locator('.games-grid, .game-cards');
    await expect(gamesGrid).toBeVisible();
  }
}
