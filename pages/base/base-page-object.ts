import { Page, Locator, expect } from '@playwright/test';

/**
 * Базовый интерфейс для всех Page Objects
 */
export interface IPageObject {
  readonly page: Page;
  readonly isLoaded: () => Promise<boolean>;
  readonly waitForLoad: () => Promise<void>;
}

/**
 * Базовый класс для всех Page Objects
 */
export abstract class BasePageObject implements IPageObject {
  constructor(public readonly page: Page) {}

  /**
   * Проверяет, загружена ли страница/компонент
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Ждет загрузки страницы/компонента
   */
  abstract waitForLoad(): Promise<void>;

  /**
   * Универсальный метод для ожидания элемента
   */
  protected async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible({ timeout });
    return element;
  }

  /**
   * Универсальный метод для клика с ожиданием
   */
  protected async clickAndWait(selector: string, timeout: number = 5000): Promise<void> {
    const element = await this.waitForElement(selector, timeout);
    await element.click();
  }

  /**
   * Универсальный метод для ввода текста
   */
  protected async fillAndWait(selector: string, text: string, timeout: number = 5000): Promise<void> {
    const element = await this.waitForElement(selector, timeout);
    await element.fill(text);
  }

  /**
   * Универсальный метод для получения текста
   */
  protected async getText(selector: string, timeout: number = 5000): Promise<string | null> {
    const element = await this.waitForElement(selector, timeout);
    return await element.textContent();
  }

  /**
   * Универсальный метод для проверки видимости
   */
  protected async expectVisible(selector: string, timeout: number = 5000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Универсальный метод для проверки скрытости
   */
  protected async expectHidden(selector: string, timeout: number = 5000): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden({ timeout });
  }
}

/**
 * Интерфейс для модальных окон
 */
export interface IModal extends IPageObject {
  readonly isOpen: () => Promise<boolean>;
  readonly open: () => Promise<void>;
  readonly close: () => Promise<void>;
}

/**
 * Базовый класс для модальных окон
 */
export abstract class BaseModal extends BasePageObject implements IModal {
  abstract isOpen(): Promise<boolean>;
  abstract open(): Promise<void>;
  abstract close(): Promise<void>;
}

/**
 * Интерфейс для форм
 */
export interface IForm extends IPageObject {
  readonly fill: (data: Record<string, string>) => Promise<void>;
  readonly submit: () => Promise<void>;
  readonly reset: () => Promise<void>;
  readonly isValid: () => Promise<boolean>;
}

/**
 * Базовый класс для форм
 */
export abstract class BaseForm extends BasePageObject implements IForm {
  abstract fill(data: Record<string, string>): Promise<void>;
  abstract submit(): Promise<void>;
  abstract reset(): Promise<void>;
  abstract isValid(): Promise<boolean>;
}

/**
 * Интерфейс для компонентов с состоянием
 */
export interface IStatefulComponent extends IPageObject {
  readonly getState: () => Promise<string>;
  readonly setState: (state: string) => Promise<void>;
  readonly waitForState: (state: string) => Promise<void>;
}

/**
 * Базовый класс для компонентов с состоянием
 */
export abstract class BaseStatefulComponent extends BasePageObject implements IStatefulComponent {
  abstract getState(): Promise<string>;
  abstract setState(state: string): Promise<void>;
  abstract waitForState(state: string): Promise<void>;
}
