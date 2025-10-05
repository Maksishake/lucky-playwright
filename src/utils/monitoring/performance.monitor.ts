/**
 * Performance Monitor
 * Система мониторинга производительности компонентов
 */

import { logger } from '../core/logger';

export interface PerformanceMetrics {
  componentName: string;
  actionName: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
}

export interface PerformanceStats {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  averageDuration: number;
  slowestAction: PerformanceMetrics | null;
  fastestAction: PerformanceMetrics | null;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static isEnabled: boolean = true;

  /**
   * Включить/выключить мониторинг
   */
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    logger.debug(`Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Начать отслеживание действия
   */
  static startAction(componentName: string, actionName: string): string {
    if (!this.isEnabled) return '';
    
    const startTime = Date.now();
    const actionId = `${componentName}-${actionName}-${startTime}`;
    
    logger.debug(`Starting action: ${actionName} on ${componentName}`);
    return actionId;
  }

  /**
   * Завершить отслеживание действия
   */
  static endAction(actionId: string, success: boolean = true, error?: string): void {
    if (!this.isEnabled || !actionId) return;
    
    const endTime = Date.now();
    const [componentName, actionName, startTimeStr] = actionId.split('-');
    const startTime = parseInt(startTimeStr, 10);
    const duration = endTime - startTime;
    
    const metric: PerformanceMetrics = {
      componentName,
      actionName,
      startTime,
      endTime,
      duration,
      success,
      error
    };
    
    this.metrics.push(metric);
    
    if (success) {
      logger.debug(`Action completed: ${actionName} on ${componentName} in ${duration}ms`);
    } else {
      logger.warning(`Action failed: ${actionName} on ${componentName} in ${duration}ms - ${error}`);
    }
  }

  /**
   * Получить статистику производительности
   */
  static getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        averageDuration: 0,
        slowestAction: null,
        fastestAction: null
      };
    }

    const successfulActions = this.metrics.filter(m => m.success).length;
    const failedActions = this.metrics.filter(m => !m.success).length;
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;

    const sortedByDuration = [...this.metrics].sort((a, b) => a.duration - b.duration);
    const slowestAction = sortedByDuration[sortedByDuration.length - 1];
    const fastestAction = sortedByDuration[0];

    return {
      totalActions: this.metrics.length,
      successfulActions,
      failedActions,
      averageDuration: Math.round(averageDuration),
      slowestAction,
      fastestAction
    };
  }

  /**
   * Получить метрики для конкретного компонента
   */
  static getComponentStats(componentName: string): PerformanceStats {
    const componentMetrics = this.metrics.filter(m => m.componentName === componentName);
    
    if (componentMetrics.length === 0) {
      return {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        averageDuration: 0,
        slowestAction: null,
        fastestAction: null
      };
    }

    const successfulActions = componentMetrics.filter(m => m.success).length;
    const failedActions = componentMetrics.filter(m => !m.success).length;
    const totalDuration = componentMetrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / componentMetrics.length;

    const sortedByDuration = [...componentMetrics].sort((a, b) => a.duration - b.duration);
    const slowestAction = sortedByDuration[sortedByDuration.length - 1];
    const fastestAction = sortedByDuration[0];

    return {
      totalActions: componentMetrics.length,
      successfulActions,
      failedActions,
      averageDuration: Math.round(averageDuration),
      slowestAction,
      fastestAction
    };
  }

  /**
   * Получить метрики для конкретного действия
   */
  static getActionStats(actionName: string): PerformanceStats {
    const actionMetrics = this.metrics.filter(m => m.actionName === actionName);
    
    if (actionMetrics.length === 0) {
      return {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        averageDuration: 0,
        slowestAction: null,
        fastestAction: null
      };
    }

    const successfulActions = actionMetrics.filter(m => m.success).length;
    const failedActions = actionMetrics.filter(m => !m.success).length;
    const totalDuration = actionMetrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / actionMetrics.length;

    const sortedByDuration = [...actionMetrics].sort((a, b) => a.duration - b.duration);
    const slowestAction = sortedByDuration[sortedByDuration.length - 1];
    const fastestAction = sortedByDuration[0];

    return {
      totalActions: actionMetrics.length,
      successfulActions,
      failedActions,
      averageDuration: Math.round(averageDuration),
      slowestAction,
      fastestAction
    };
  }

  /**
   * Очистить все метрики
   */
  static clearMetrics(): void {
    this.metrics = [];
    logger.debug('Performance metrics cleared');
  }

  /**
   * Экспортировать метрики в JSON
   */
  static exportMetrics(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      metrics: this.metrics
    }, null, 2);
  }

  /**
   * Получить топ-10 самых медленных действий
   */
  static getSlowestActions(limit: number = 10): PerformanceMetrics[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Получить топ-10 самых быстрых действий
   */
  static getFastestActions(limit: number = 10): PerformanceMetrics[] {
    return [...this.metrics]
      .sort((a, b) => a.duration - b.duration)
      .slice(0, limit);
  }

  /**
   * Проверить, есть ли медленные действия
   */
  static hasSlowActions(threshold: number = 5000): boolean {
    return this.metrics.some(m => m.duration > threshold);
  }

  /**
   * Получить предупреждения о производительности
   */
  static getPerformanceWarnings(threshold: number = 5000): string[] {
    const warnings: string[] = [];
    const slowActions = this.metrics.filter(m => m.duration > threshold);
    
    if (slowActions.length > 0) {
      warnings.push(`Found ${slowActions.length} slow actions (>${threshold}ms)`);
    }
    
    const failedActions = this.metrics.filter(m => !m.success);
    if (failedActions.length > 0) {
      warnings.push(`Found ${failedActions.length} failed actions`);
    }
    
    return warnings;
  }
}
