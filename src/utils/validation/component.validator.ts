/**
 * Component Validator
 * Система валидации компонентов
 */

import { Page, Locator } from '@playwright/test';
import { logger } from '../core/logger';

export interface ValidationRule {
  name: string;
  validate: (component: any) => Promise<boolean>;
  errorMessage: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ComponentValidator {
  private static rules: Map<string, ValidationRule[]> = new Map();

  /**
   * Добавить правило валидации для типа компонента
   */
  static addRule(componentType: string, rule: ValidationRule): void {
    if (!this.rules.has(componentType)) {
      this.rules.set(componentType, []);
    }
    this.rules.get(componentType)!.push(rule);
  }

  /**
   * Валидировать компонент
   */
  static async validate(component: any, componentType: string): Promise<ValidationResult> {
    const rules = this.rules.get(componentType) || [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(component);
        if (!isValid) {
          errors.push(rule.errorMessage);
        }
      } catch (error) {
        warnings.push(`Validation rule ${rule.name} failed: ${error.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Создать правило для проверки видимости
   */
  static createVisibilityRule(): ValidationRule {
    return {
      name: 'visibility',
      validate: async (component) => {
        return await component.isVisible();
      },
      errorMessage: 'Component is not visible'
    };
  }

  /**
   * Создать правило для проверки загрузки
   */
  static createLoadingRule(): ValidationRule {
    return {
      name: 'loading',
      validate: async (component) => {
        return await component.isLoaded();
      },
      errorMessage: 'Component is not loaded'
    };
  }

  /**
   * Создать правило для проверки активности
   */
  static createEnabledRule(): ValidationRule {
    return {
      name: 'enabled',
      validate: async (component) => {
        return await component.isEnabled();
      },
      errorMessage: 'Component is not enabled'
    };
  }

  /**
   * Создать правило для проверки текста
   */
  static createTextRule(expectedText?: string): ValidationRule {
    return {
      name: 'text',
      validate: async (component) => {
        const text = await component.getText();
        if (expectedText) {
          return text.includes(expectedText);
        }
        return text.length > 0;
      },
      errorMessage: expectedText 
        ? `Component text does not contain expected text: ${expectedText}`
        : 'Component text is empty'
    };
  }

  /**
   * Создать правило для проверки атрибута
   */
  static createAttributeRule(attributeName: string, expectedValue?: string): ValidationRule {
    return {
      name: `attribute_${attributeName}`,
      validate: async (component) => {
        const value = await component.getAttribute(attributeName);
        if (expectedValue) {
          return value === expectedValue;
        }
        return value !== null;
      },
      errorMessage: expectedValue
        ? `Component attribute ${attributeName} does not equal ${expectedValue}`
        : `Component attribute ${attributeName} is missing`
    };
  }

  /**
   * Создать правило для проверки CSS класса
   */
  static createClassRule(className: string): ValidationRule {
    return {
      name: `class_${className}`,
      validate: async (component) => {
        const classList = await component.getAttribute('class');
        return classList?.includes(className) || false;
      },
      errorMessage: `Component does not have CSS class: ${className}`
    };
  }

  /**
   * Создать правило для проверки размеров
   */
  static createSizeRule(minWidth?: number, minHeight?: number): ValidationRule {
    return {
      name: 'size',
      validate: async (component) => {
        const boundingBox = await component.root.boundingBox();
        if (!boundingBox) return false;
        
        if (minWidth && boundingBox.width < minWidth) return false;
        if (minHeight && boundingBox.height < minHeight) return false;
        
        return true;
      },
      errorMessage: `Component size is too small (min: ${minWidth}x${minHeight})`
    };
  }

  /**
   * Получить все правила для типа компонента
   */
  static getRules(componentType: string): ValidationRule[] {
    return this.rules.get(componentType) || [];
  }

  /**
   * Очистить правила для типа компонента
   */
  static clearRules(componentType: string): void {
    this.rules.delete(componentType);
  }

  /**
   * Очистить все правила
   */
  static clearAllRules(): void {
    this.rules.clear();
  }
}
