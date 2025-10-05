/**
 * Badge Component - Atom
 * Атомарный компонент бейджа
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { ITextComponent } from '@core/interfaces/component.interface';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';

export class BadgeComponent extends BaseComponent implements ITextComponent {
  constructor(page: Page, root: Locator, componentName: string = 'Badge') {
    super(page, root, componentName);
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость бейджа
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить загрузку бейджа
   */
  async isLoaded(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Дождаться загрузки бейджа
   */
  async waitForLoad(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========

  /**
   * Получить текст бейджа
   */
  @LogAction('Get badge text')
  async getText(): Promise<string> {
    try {
      return await this.root.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Получить атрибут бейджа
   */
  async getAttribute(name: string): Promise<string | null> {
    try {
      return await this.root.getAttribute(name);
    } catch {
      return null;
    }
  }

  // ========== ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, является ли бейдж активным
   */
  async isActive(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('active') || classList?.includes('selected') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж новым
   */
  async isNew(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('new') || classList?.includes('badge-new') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж горячим
   */
  async isHot(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('hot') || classList?.includes('badge-hot') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж популярным
   */
  async isPopular(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('popular') || classList?.includes('badge-popular') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж призом
   */
  async isPrize(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('prize') || classList?.includes('badge-prize') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж статусом
   */
  async isStatus(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('status') || classList?.includes('badge-status') || false;
    } catch {
      return false;
    }
  }

  /**
   * Проверить, является ли бейдж счетчиком
   */
  async isCount(): Promise<boolean> {
    try {
      const classList = await this.getAttribute('class');
      return classList?.includes('count') || classList?.includes('badge-count') || false;
    } catch {
      return false;
    }
  }

  /**
   * Получить тип бейджа
   */
  @LogAction('Get badge type')
  async getBadgeType(): Promise<string | null> {
    return await this.getAttribute('data-type') || await this.getAttribute('data-badge-type');
  }

  /**
   * Получить цвет бейджа
   */
  @LogAction('Get badge color')
  async getBadgeColor(): Promise<string | null> {
    return await this.getAttribute('data-color') || await this.getAttribute('data-badge-color');
  }

  /**
   * Получить размер бейджа
   */
  @LogAction('Get badge size')
  async getBadgeSize(): Promise<string | null> {
    return await this.getAttribute('data-size') || await this.getAttribute('data-badge-size');
  }

  /**
   * Получить значение бейджа
   */
  @LogAction('Get badge value')
  async getBadgeValue(): Promise<string | null> {
    return await this.getAttribute('data-value') || await this.getAttribute('data-badge-value');
  }

  /**
   * Получить информацию о бейдже
   */
  @LogAction('Get badge info')
  async getBadgeInfo(): Promise<{
    text: string;
    type: string | null;
    color: string | null;
    size: string | null;
    value: string | null;
    isActive: boolean;
    isNew: boolean;
    isHot: boolean;
    isPopular: boolean;
    isPrize: boolean;
    isStatus: boolean;
    isCount: boolean;
  }> {
    const [
      text,
      type,
      color,
      size,
      value,
      isActive,
      isNew,
      isHot,
      isPopular,
      isPrize,
      isStatus,
      isCount
    ] = await Promise.all([
      this.getText(),
      this.getBadgeType(),
      this.getBadgeColor(),
      this.getBadgeSize(),
      this.getBadgeValue(),
      this.isActive(),
      this.isNew(),
      this.isHot(),
      this.isPopular(),
      this.isPrize(),
      this.isStatus(),
      this.isCount()
    ]);

    return {
      text,
      type,
      color,
      size,
      value,
      isActive,
      isNew,
      isHot,
      isPopular,
      isPrize,
      isStatus,
      isCount
    };
  }
}
