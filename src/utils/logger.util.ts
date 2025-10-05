/**
 * Logger Utility
 * Утилита для логирования
 */

export class Logger {
  private static isEnabled: boolean = true;
  private static logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  /**
   * Включить/выключить логирование
   */
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Установить уровень логирования
   */
  static setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }

  /**
   * Логировать шаг
   */
  static step(message: string, details?: string): void {
    if (!this.isEnabled || this.shouldLog('info')) return;
    
    const timestamp = new Date().toISOString();
    const detailsStr = details ? ` - ${details}` : '';
    console.log(`[${timestamp}] 🔄 ${message}${detailsStr}`);
  }

  /**
   * Логировать успех
   */
  static success(message: string): void {
    if (!this.isEnabled || this.shouldLog('info')) return;
    
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ ${message}`);
  }

  /**
   * Логировать ошибку
   */
  static error(message: string, error?: Error): void {
    if (!this.isEnabled || this.shouldLog('error')) return;
    
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${message}`);
    
    if (error) {
      console.error(`[${timestamp}] Error details:`, error.message);
      if (error.stack) {
        console.error(`[${timestamp}] Stack trace:`, error.stack);
      }
    }
  }

  /**
   * Логировать предупреждение
   */
  static warning(message: string): void {
    if (!this.isEnabled || this.shouldLog('warn')) return;
    
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️ ${message}`);
  }

  /**
   * Логировать отладочную информацию
   */
  static debug(message: string, data?: any): void {
    if (!this.isEnabled || this.shouldLog('debug')) return;
    
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🐛 ${message}`);
    
    if (data) {
      console.log(`[${timestamp}] Debug data:`, data);
    }
  }

  /**
   * Логировать информацию
   */
  static info(message: string, data?: any): void {
    if (!this.isEnabled || this.shouldLog('info')) return;
    
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️ ${message}`);
    
    if (data) {
      console.log(`[${timestamp}] Info data:`, data);
    }
  }

  /**
   * Проверить, нужно ли логировать
   */
  private static shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Логировать группу действий
   */
  static group(name: string, actions: () => void): void {
    if (!this.isEnabled) return;
    
    console.group(`🔄 ${name}`);
    actions();
    console.groupEnd();
  }

  /**
   * Логировать время выполнения
   */
  static time(label: string): void {
    if (!this.isEnabled) return;
    console.time(`⏱️ ${label}`);
  }

  /**
   * Завершить логирование времени
   */
  static timeEnd(label: string): void {
    if (!this.isEnabled) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  /**
   * Логировать таблицу данных
   */
  static table(data: any[]): void {
    if (!this.isEnabled || this.shouldLog('debug')) return;
    console.table(data);
  }

  /**
   * Логировать объект
   */
  static object(obj: any, label?: string): void {
    if (!this.isEnabled || this.shouldLog('debug')) return;
    
    if (label) {
      console.log(`🔍 ${label}:`, obj);
    } else {
      console.log('🔍 Object:', obj);
    }
  }
}

// Экспорт экземпляра логгера
export const logger = Logger;

// Экспорт по умолчанию
export default Logger;
