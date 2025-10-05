/**
 * Component Interface
 * Интерфейс для всех компонентов
 */

import { Page, Locator } from '@playwright/test';

export interface IComponent {
  page: Page;
  root: Locator;
  componentName: string;
  
  isVisible(): Promise<boolean>;
  isLoaded(): Promise<boolean>;
  waitForLoad(): Promise<void>;
}

export interface IInteractiveComponent extends IComponent {
  click(): Promise<void>;
  hover(): Promise<void>;
  isEnabled(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
}

export interface ITextComponent extends IComponent {
  getText(): Promise<string>;
  getAttribute(name: string): Promise<string | null>;
}

export interface IFormComponent extends IInteractiveComponent, ITextComponent {
  fill(value: string): Promise<void>;
  clear(): Promise<void>;
  getValue(): Promise<string>;
  isFocused(): Promise<boolean>;
}

export interface IContainerComponent extends IComponent {
  getChildCount(): Promise<number>;
  getChild(index: number): Locator;
  hasChildren(): Promise<boolean>;
}
