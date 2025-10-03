import { Page } from '@playwright/test';

// Pages
import { BonusesPage } from '../../pages/bonuses.page';

// Components
import { HeaderComponent } from '../../pages/components/header.component';
import { FooterPage } from '../../pages/components/footer.component';
import { SidebarPage } from '../../pages/components/sidebar.component';
import { MainPageBodyPage } from '../../pages/components/main-content.component';

// Providers and Filters
import { FilterCategoryProvider } from '../../pages/components/filter-category-provider.component';

/**
 * Фабрика для создания Page Objects (страницы и компоненты)
 */
export class PageFactory {
  constructor(private readonly page: Page) {}

  // ========== СТРАНИЦЫ ==========

  createBonusesPage(): BonusesPage {
    return new BonusesPage(this.page);
  }

  // ========== КОМПОНЕНТЫ ==========

  createHeader(): HeaderComponent {
    return new HeaderComponent(this.page);
  }

  createFooter(): FooterPage {
    return new FooterPage(this.page);
  }

  createSidebar(): SidebarPage {
    return new SidebarPage(this.page);
  }

  createMainContent(): MainPageBodyPage {
    return new MainPageBodyPage(this.page);
  }

  // ========== ФИЛЬТРЫ И ПРОВАЙДЕРЫ ==========

  createFilterCategoryProvider(): FilterCategoryProvider {
    return new FilterCategoryProvider(this.page);
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  /**
   * Возвращает экземпляр Page
   */
  getPage(): Page {
    return this.page;
  }
}
