/**
 * Support Content Component - Organism
 * Компонент контента центра поддержки
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@core/abstract/base.component';
import { LogAction, ValidateState } from '@core/decorators/logger.decorator';
import { logger } from '@utils/logger.util';
import { TIMEOUTS } from '@config/constants';

export class SupportContentComponent extends BaseComponent {
  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить видимость компонента
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.root.isVisible();
    } catch {
      return false;
    }
  }

  // ========== ЛОКАТОРЫ ==========

  // Основной контент
  readonly contentContainer: Locator;

  // Заголовки разделов
  readonly mainTitle: Locator;
  readonly sectionHeaders: Locator;

  // Параграфы
  readonly paragraphs: Locator;

  // Списки
  readonly lists: Locator;

  constructor(page: Page, root: Locator, componentName: string = 'Support Content') {
    super(page, root, componentName);

    this.contentContainer = this.root;
    this.mainTitle = this.root.locator('h3');
    this.sectionHeaders = this.root.locator('h4');
    this.paragraphs = this.root.locator('p');
    this.lists = this.root.locator('ul');
  }

  // ========== БАЗОВЫЕ МЕТОДЫ ==========

  /**
   * Проверить загрузку компонента контента
   */
  @LogAction('Проверка загрузки компонента контента поддержки')
  @ValidateState()
  async isLoaded(): Promise<boolean> {
    return await this.contentContainer.isVisible() &&
           await this.mainTitle.isVisible() &&
           await this.sectionHeaders.first().isVisible();
  }

  /**
   * Дождаться загрузки компонента контента
   */
  @LogAction('Ожидание загрузки компонента контента поддержки')
  async waitForLoad(): Promise<void> {
    await this.contentContainer.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.mainTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await this.sectionHeaders.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    logger.success('Компонент контента поддержки загружен');
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ==========

  /**
   * Получить основной заголовок
   */
  @LogAction('Получение основного заголовка')
  @ValidateState()
  async getMainTitle(): Promise<string> {
    try {
      const title = await this.mainTitle.textContent();
      logger.success(`Основной заголовок: ${title}`);
      return title?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения основного заголовка', error as Error);
      return '';
    }
  }

  /**
   * Получить все заголовки разделов
   */
  @LogAction('Получение всех заголовков разделов')
  @ValidateState()
  async getAllHeaders(): Promise<string[]> {
    try {
      const headers = await this.sectionHeaders.allTextContents();
      const trimmedHeaders = headers.map(header => header.trim());
      logger.success(`Заголовки разделов: ${trimmedHeaders.join(', ')}`);
      return trimmedHeaders;
    } catch (error) {
      logger.error('Ошибка получения заголовков разделов', error as Error);
      return [];
    }
  }

  /**
   * Получить заголовок по индексу
   * @param index Индекс заголовка
   */
  @LogAction('Получение заголовка по индексу: {index}')
  @ValidateState()
  async getHeaderByIndex(index: number): Promise<string> {
    try {
      const header = await this.sectionHeaders.nth(index).textContent();
      logger.success(`Заголовок по индексу ${index}: ${header}`);
      return header?.trim() || '';
    } catch (error) {
      logger.error(`Ошибка получения заголовка по индексу ${index}`, error as Error);
      return '';
    }
  }

  /**
   * Получить текущий контент
   */
  @LogAction('Получение текущего контента')
  @ValidateState()
  async getCurrentContent(): Promise<string> {
    try {
      const content = await this.contentContainer.textContent();
      logger.success('Текущий контент получен');
      return content?.trim() || '';
    } catch (error) {
      logger.error('Ошибка получения текущего контента', error as Error);
      return '';
    }
  }

  /**
   * Получить количество разделов
   */
  @LogAction('Получение количества разделов')
  @ValidateState()
  async getSectionsCount(): Promise<number> {
    try {
      const count = await this.sectionHeaders.count();
      logger.success(`Количество разделов: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества разделов', error as Error);
      return 0;
    }
  }

  /**
   * Получить количество параграфов
   */
  @LogAction('Получение количества параграфов')
  @ValidateState()
  async getParagraphsCount(): Promise<number> {
    try {
      const count = await this.paragraphs.count();
      logger.success(`Количество параграфов: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества параграфов', error as Error);
      return 0;
    }
  }

  /**
   * Получить количество списков
   */
  @LogAction('Получение количества списков')
  @ValidateState()
  async getListsCount(): Promise<number> {
    try {
      const count = await this.lists.count();
      logger.success(`Количество списков: ${count}`);
      return count;
    } catch (error) {
      logger.error('Ошибка получения количества списков', error as Error);
      return 0;
    }
  }

  // ========== МЕТОДЫ ПОИСКА ==========

  /**
   * Найти раздел по заголовку
   * @param headerText Текст заголовка
   */
  @LogAction('Поиск раздела по заголовку: {headerText}')
  @ValidateState()
  async findSectionByHeader(headerText: string): Promise<boolean> {
    try {
      const header = this.sectionHeaders.filter({ hasText: headerText });
      const isVisible = await header.isVisible();
      logger.success(`Раздел с заголовком "${headerText}" найден: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Ошибка поиска раздела по заголовку "${headerText}"`, error as Error);
      return false;
    }
  }

  /**
   * Найти параграф по тексту
   * @param text Текст для поиска
   */
  @LogAction('Поиск параграфа по тексту: {text}')
  @ValidateState()
  async findParagraphByText(text: string): Promise<boolean> {
    try {
      const paragraph = this.paragraphs.filter({ hasText: text });
      const isVisible = await paragraph.isVisible();
      logger.success(`Параграф с текстом "${text}" найден: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Ошибка поиска параграфа по тексту "${text}"`, error as Error);
      return false;
    }
  }

  /**
   * Найти список по тексту
   * @param text Текст для поиска
   */
  @LogAction('Поиск списка по тексту: {text}')
  @ValidateState()
  async findListByText(text: string): Promise<boolean> {
    try {
      const list = this.lists.filter({ hasText: text });
      const isVisible = await list.isVisible();
      logger.success(`Список с текстом "${text}" найден: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Ошибка поиска списка по тексту "${text}"`, error as Error);
      return false;
    }
  }

  // ========== МЕТОДЫ ПОЛУЧЕНИЯ ДЕТАЛЬНОЙ ИНФОРМАЦИИ ==========

  /**
   * Получить содержимое раздела по заголовку
   * @param headerText Текст заголовка
   */
  @LogAction('Получение содержимого раздела по заголовку: {headerText}')
  @ValidateState()
  async getSectionContentByHeader(headerText: string): Promise<string> {
    try {
      const header = this.sectionHeaders.filter({ hasText: headerText });
      if (await header.isVisible()) {
        // Получаем следующий элемент после заголовка
        const nextElement = header.locator('..').locator('+ *');
        const content = await nextElement.textContent();
        logger.success(`Содержимое раздела "${headerText}" получено`);
        return content?.trim() || '';
      }
      return '';
    } catch (error) {
      logger.error(`Ошибка получения содержимого раздела "${headerText}"`, error as Error);
      return '';
    }
  }

  /**
   * Получить все параграфы раздела
   * @param headerText Текст заголовка раздела
   */
  @LogAction('Получение всех параграфов раздела: {headerText}')
  @ValidateState()
  async getSectionParagraphs(headerText: string): Promise<string[]> {
    try {
      const header = this.sectionHeaders.filter({ hasText: headerText });
      if (await header.isVisible()) {
        // Получаем все параграфы после заголовка до следующего заголовка
        const paragraphs = await header.locator('..').locator('p').allTextContents();
        const trimmedParagraphs = paragraphs.map(p => p.trim());
        logger.success(`Параграфы раздела "${headerText}" получены`);
        return trimmedParagraphs;
      }
      return [];
    } catch (error) {
      logger.error(`Ошибка получения параграфов раздела "${headerText}"`, error as Error);
      return [];
    }
  }

  /**
   * Получить все списки раздела
   * @param headerText Текст заголовка раздела
   */
  @LogAction('Получение всех списков раздела: {headerText}')
  @ValidateState()
  async getSectionLists(headerText: string): Promise<string[]> {
    try {
      const header = this.sectionHeaders.filter({ hasText: headerText });
      if (await header.isVisible()) {
        // Получаем все списки после заголовка до следующего заголовка
        const lists = await header.locator('..').locator('ul').allTextContents();
        const trimmedLists = lists.map(list => list.trim());
        logger.success(`Списки раздела "${headerText}" получены`);
        return trimmedLists;
      }
      return [];
    } catch (error) {
      logger.error(`Ошибка получения списков раздела "${headerText}"`, error as Error);
      return [];
    }
  }

  // ========== МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ==========

  /**
   * Проверить, что основной заголовок отображается
   */
  @LogAction('Проверка отображения основного заголовка')
  async isMainTitleVisible(): Promise<boolean> {
    try {
      return await this.mainTitle.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что заголовки разделов отображаются
   */
  @LogAction('Проверка отображения заголовков разделов')
  async areSectionHeadersVisible(): Promise<boolean> {
    try {
      return await this.sectionHeaders.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что параграфы отображаются
   */
  @LogAction('Проверка отображения параграфов')
  async areParagraphsVisible(): Promise<boolean> {
    try {
      return await this.paragraphs.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверить, что списки отображаются
   */
  @LogAction('Проверка отображения списков')
  async areListsVisible(): Promise<boolean> {
    try {
      return await this.lists.first().isVisible();
    } catch {
      return false;
    }
  }

  // ========== МЕТОДЫ ВАЛИДАЦИИ ==========

  /**
   * Проверить, что контент содержит основные разделы
   */
  @LogAction('Проверка наличия основных разделов')
  async hasMainSections(): Promise<boolean> {
    try {
      const expectedSections = [
        'Основні терміни',
        'Загальні положення та умови',
        'Відповідальність гравців',
        'Правила ідентифікації та верифікації гравців'
      ];

      let foundSections = 0;
      for (const section of expectedSections) {
        if (await this.findSectionByHeader(section)) {
          foundSections++;
        }
      }

      const hasSections = foundSections >= expectedSections.length / 2;
      logger.success(`Основные разделы найдены: ${hasSections}`);
      return hasSections;
    } catch (error) {
      logger.error('Ошибка проверки наличия основных разделов', error as Error);
      return false;
    }
  }

  /**
   * Проверить, что контент содержит текст
   */
  @LogAction('Проверка наличия текста в контенте')
  async hasContent(): Promise<boolean> {
    try {
      const content = await this.getCurrentContent();
      const hasContent = content.length > 0;
      logger.success(`Контент содержит текст: ${hasContent}`);
      return hasContent;
    } catch (error) {
      logger.error('Ошибка проверки наличия текста в контенте', error as Error);
      return false;
    }
  }
}
