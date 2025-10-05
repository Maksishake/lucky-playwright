/**
 * Component Decorators
 * Декораторы для компонентов с логированием и перехватом
 */

import { logger } from '../core/logger';
import { Waiter } from '../core/waiter';

/**
 * Декоратор для логирования действий компонента
 */
export function LogAction(actionName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      logger.step(`${actionName} started`);
      
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        logger.success(`${actionName} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`${actionName} failed after ${duration}ms`, error);
        throw error;
      }
    };
  };
}

/**
 * Декоратор для повторных попыток
 */
export function Retryable(maxRetries: number = 3, delay: number = 1000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < maxRetries) {
            logger.warning(`${propertyName} attempt ${attempt} failed, retrying in ${delay}ms...`);
            await Waiter.wait(delay);
          } else {
            logger.error(`${propertyName} failed after ${maxRetries} attempts`);
            throw lastError;
          }
        }
      }
    };
  };
}

/**
 * Декоратор для валидации состояния компонента
 */
export function ValidateState() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Проверяем, что компонент видим
      if (!(await this.isVisible())) {
        throw new Error(`Component ${this.componentName} is not visible`);
      }

      // Проверяем, что компонент загружен
      if (!(await this.isLoaded())) {
        throw new Error(`Component ${this.componentName} is not loaded`);
      }

      return await method.apply(this, args);
    };
  };
}

/**
 * Декоратор для ожидания стабильности
 */
export function WaitForStable(timeout: number = 2000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await Waiter.waitForStableElement(this.root, timeout);
      return await method.apply(this, args);
    };
  };
}

/**
 * Декоратор для скриншотов при ошибках
 */
export function ScreenshotOnError() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        try {
          const screenshot = await this.page.screenshot({ 
            path: `error-${propertyName}-${Date.now()}.png`,
            fullPage: true 
          });
          logger.debug(`Screenshot saved for error in ${propertyName}`);
        } catch (screenshotError) {
          logger.warning('Failed to take screenshot on error');
        }
        throw error;
      }
    };
  };
}
