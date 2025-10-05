/**
 * Cache Decorator
 * Декоратор для кэширования результатов
 */

import { logger } from '@utils/logger.util';

/**
 * Декоратор для кэширования результатов методов
 */
export function Cacheable(ttl: number = 5000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new Map<string, { value: any; timestamp: number }>();
    
    descriptor.value = async function (...args: any[]) {
      const key = JSON.stringify(args);
      const now = Date.now();
      
      // Проверяем кэш
      if (cache.has(key)) {
        const cached = cache.get(key)!;
        if (now - cached.timestamp < ttl) {
          logger.debug(`Cache hit for ${propertyName}`);
          return cached.value;
        } else {
          cache.delete(key);
        }
      }
      
      // Выполняем метод и кэшируем результат
      const result = await method.apply(this, args);
      cache.set(key, { value: result, timestamp: now });
      
      // Очищаем устаревшие записи
      for (const [k, v] of cache.entries()) {
        if (now - v.timestamp >= ttl) {
          cache.delete(k);
        }
      }
      
      logger.debug(`Cached result for ${propertyName}`);
      return result;
    };
  };
}

/**
 * Декоратор для кэширования с ключом
 */
export function CacheableWithKey(keyGenerator: (...args: any[]) => string, ttl: number = 5000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new Map<string, { value: any; timestamp: number }>();
    
    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator(...args);
      const now = Date.now();
      
      // Проверяем кэш
      if (cache.has(key)) {
        const cached = cache.get(key)!;
        if (now - cached.timestamp < ttl) {
          logger.debug(`Cache hit for ${propertyName} with key: ${key}`);
          return cached.value;
        } else {
          cache.delete(key);
        }
      }
      
      // Выполняем метод и кэшируем результат
      const result = await method.apply(this, args);
      cache.set(key, { value: result, timestamp: now });
      
      logger.debug(`Cached result for ${propertyName} with key: ${key}`);
      return result;
    };
  };
}

/**
 * Декоратор для очистки кэша
 */
export function ClearCache() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);
      
      // Очищаем кэш для всех методов класса
      const cacheKeys = Object.getOwnPropertyNames(target.constructor.prototype)
        .filter(name => name !== propertyName);
      
      for (const key of cacheKeys) {
        const descriptor = Object.getOwnPropertyDescriptor(target.constructor.prototype, key);
        if (descriptor && descriptor.value && descriptor.value._cache) {
          descriptor.value._cache.clear();
        }
      }
      
      logger.debug(`Cache cleared for ${propertyName}`);
      return result;
    };
  };
}
