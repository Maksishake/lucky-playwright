/**
 * Validation Decorator
 * Декоратор для валидации компонентов
 */

import { logger } from '@utils/logger.util';

/**
 * Декоратор для валидации состояния компонента
 * (Перенесен в logger.decorator.ts)
 */

/**
 * Декоратор для валидации с кастомными правилами
 */
export function ValidateWith(rules: Array<(component: any) => Promise<boolean>>) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      for (const rule of rules) {
        const isValid = await rule(this);
        if (!isValid) {
          throw new Error(`Validation rule failed for ${(this as any).componentName}`);
        }
      }

      return await method.apply(this, args);
    };
  };
}

/**
 * Декоратор для валидации параметров
 */
export function ValidateParams(validator: (...args: any[]) => boolean) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (!validator(...args)) {
        throw new Error(`Invalid parameters for ${propertyName}`);
      }

      return await method.apply(this, args);
    };
  };
}

/**
 * Декоратор для валидации результата
 */
export function ValidateResult(validator: (result: any) => boolean) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);
      
      if (!validator(result)) {
        throw new Error(`Invalid result from ${propertyName}`);
      }

      return result;
    };
  };
}

/**
 * Декоратор для повторных попыток с валидацией
 */
export function RetryWithValidation(maxRetries: number = 3, delay: number = 1000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Проверяем состояние перед выполнением
          if (!(await (this as any).isVisible())) {
            throw new Error(`Component ${(this as any).componentName} is not visible`);
          }

          if (!(await (this as any).isLoaded())) {
            throw new Error(`Component ${(this as any).componentName} is not loaded`);
          }

          const result = await method.apply(this, args);
          return result;
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < maxRetries) {
            logger.warning(`${propertyName} attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            logger.error(`${propertyName} failed after ${maxRetries} attempts`);
            throw lastError;
          }
        }
      }
    };
  };
}
