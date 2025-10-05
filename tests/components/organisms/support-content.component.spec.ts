/**
 * Support Content Component Tests
 * Тесты для компонента контента поддержки
 */

import { test, expect } from '@playwright/test';
import { SupportContentComponent } from '@components/organisms/support-content';

test.describe('SupportContentComponent', () => {
  let supportContent: SupportContentComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div class="row flex-col gap-lg text-white">
        <h3 class="my-0">ПРАВИЛА ОРГАНІЗАТОРА АЗАРТНИХ ІГОР КАЗИНО В МЕРЕЖІ ІНТЕРНЕТ "Luckycoin"</h3>
        <h4 class="my-0">Основні терміни</h4>
        <p>Вебсайт організатора азартних ігор — це одна вебсторінка або набір вебсторінок, через які Організатор здійснює свою діяльність в Інтернеті, використовуючи виключно один бренд.</p>
        <p>Азартна гра — це гра, участь у якій передбачає внесення Гравцем ставки, що надає право на отримання виграшу (призу). Ймовірність отримання виграшу та його розмір залежать повністю або частково від випадковості, а також від знань і майстерності Гравця.</p>
        <h4 class="my-0">Загальні положення та умови</h4>
        <p>1.1 Умови та документи зазначені нижче, застосовуються для врегулювання відносин між Організатором («luckycoin.gold») та клієнтом (гравцем) під час використання Веб-сайту («luckycoin.gold») а також пов'язаних служб (разом іменуються "Сервіс") які відповідають вимогам, визначеним Законом України «Про державне регулювання діяльності щодо організації та проведення азартних ігор».</p>
        <h4 class="my-0">Відповідальність гравців</h4>
        <p>2.1 Гравцем може бути лише фізична особа, яка на момент участі в азартній грі досягла 18-річного віку. Організатор не має права приймати ставки або виплачувати (видавати) виграші (призи) особам, які не досягли 18 років.</p>
        <ul>
          <li>Особи, які не досягли 18-річного віку.</li>
          <li>Особи, на яких поширюються відповідні обмеження згідно із законодавством.</li>
          <li>Особи, які визнані Організатором азартних ігор небажаними.</li>
        </ul>
      </div>
    `);
    supportContent = new SupportContentComponent(page, page.locator('.row'));
  });

  test('should be loaded', async () => {
    await expect(supportContent.isLoaded()).resolves.toBeTruthy();
  });

  test('should get main title', async () => {
    await expect(supportContent.getMainTitle()).resolves.toBe('ПРАВИЛА ОРГАНІЗАТОРА АЗАРТНИХ ІГОР КАЗИНО В МЕРЕЖІ ІНТЕРНЕТ "Luckycoin"');
  });

  test('should get all section headers', async () => {
    const headers = await supportContent.getAllHeaders();
    expect(headers).toEqual([
      'Основні терміни',
      'Загальні положення та умови',
      'Відповідальність гравців'
    ]);
  });

  test('should get header by index', async () => {
    await expect(supportContent.getHeaderByIndex(0)).resolves.toBe('Основні терміни');
    await expect(supportContent.getHeaderByIndex(1)).resolves.toBe('Загальні положення та умови');
    await expect(supportContent.getHeaderByIndex(2)).resolves.toBe('Відповідальність гравців');
  });

  test('should get current content', async () => {
    const content = await supportContent.getCurrentContent();
    expect(content).toContain('ПРАВИЛА ОРГАНІЗАТОРА АЗАРТНИХ ІГОР КАЗИНО В МЕРЕЖІ ІНТЕРНЕТ "Luckycoin"');
    expect(content).toContain('Основні терміни');
    expect(content).toContain('Загальні положення та умови');
    expect(content).toContain('Відповідальність гравців');
  });

  test('should get sections count', async () => {
    const count = await supportContent.getSectionsCount();
    expect(count).toBe(3);
  });

  test('should get paragraphs count', async () => {
    const count = await supportContent.getParagraphsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should get lists count', async () => {
    const count = await supportContent.getListsCount();
    expect(count).toBe(1);
  });

  test('should find section by header', async () => {
    await expect(supportContent.findSectionByHeader('Основні терміни')).resolves.toBeTruthy();
    await expect(supportContent.findSectionByHeader('Загальні положення та умови')).resolves.toBeTruthy();
    await expect(supportContent.findSectionByHeader('Відповідальність гравців')).resolves.toBeTruthy();
    await expect(supportContent.findSectionByHeader('Несуществующий раздел')).resolves.toBeFalsy();
  });

  test('should find paragraph by text', async () => {
    await expect(supportContent.findParagraphByText('Вебсайт організатора азартних ігор')).resolves.toBeTruthy();
    await expect(supportContent.findParagraphByText('Азартна гра — це гра')).resolves.toBeTruthy();
    await expect(supportContent.findParagraphByText('Несуществующий текст')).resolves.toBeFalsy();
  });

  test('should find list by text', async () => {
    await expect(supportContent.findListByText('Особи, які не досягли 18-річного віку')).resolves.toBeTruthy();
    await expect(supportContent.findListByText('Несуществующий элемент списка')).resolves.toBeFalsy();
  });

  test('should get section content by header', async () => {
    const content = await supportContent.getSectionContentByHeader('Основні терміни');
    expect(content).toContain('Вебсайт організатора азартних ігор');
    expect(content).toContain('Азартна гра — це гра');
  });

  test('should get section paragraphs', async () => {
    const paragraphs = await supportContent.getSectionParagraphs('Основні терміни');
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(paragraphs[0]).toContain('Вебсайт організатора азартних ігор');
  });

  test('should get section lists', async () => {
    const lists = await supportContent.getSectionLists('Відповідальність гравців');
    expect(lists.length).toBeGreaterThan(0);
    expect(lists[0]).toContain('Особи, які не досягли 18-річного віку');
  });

  test('should check if main title is visible', async () => {
    await expect(supportContent.isMainTitleVisible()).resolves.toBeTruthy();
  });

  test('should check if section headers are visible', async () => {
    await expect(supportContent.areSectionHeadersVisible()).resolves.toBeTruthy();
  });

  test('should check if paragraphs are visible', async () => {
    await expect(supportContent.areParagraphsVisible()).resolves.toBeTruthy();
  });

  test('should check if lists are visible', async () => {
    await expect(supportContent.areListsVisible()).resolves.toBeTruthy();
  });

  test('should check if has main sections', async () => {
    await expect(supportContent.hasMainSections()).resolves.toBeTruthy();
  });

  test('should check if has content', async () => {
    await expect(supportContent.hasContent()).resolves.toBeTruthy();
  });
});
