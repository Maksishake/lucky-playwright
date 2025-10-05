/**
 * Logger Decorator
 * Декоратор для логирования действий
 */

import { logger } from '@utils/logger.util';

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
        logger.error(`${actionName} failed after ${duration}ms`, error as Error);
        throw error;
      }
    };
  };
}

/**
 * Декоратор для логирования с деталями
 */
export function LogActionWithDetails(actionName: string, getDetails?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const details = getDetails ? getDetails(...args) : undefined;
      logger.step(`${actionName} started`, details);
      
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        logger.success(`${actionName} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`${actionName} failed after ${duration}ms`, error as Error);
        throw error;
      }
    };
  };
}

/**
 * Декоратор для логирования только ошибок
 */
export function LogErrors(actionName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        logger.error(`${actionName} failed`, error as Error);
        throw error;
      }
    };
  };
}

/**
 * Декоратор для валидации состояния компонента
 */
export function ValidateState() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (!await (this as any).isVisible()) {
        throw new Error(`${(this as any).componentName} is not visible`);
      }
      
      if (!await (this as any).isLoaded()) {
        throw new Error(`${(this as any).componentName} is not loaded`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
