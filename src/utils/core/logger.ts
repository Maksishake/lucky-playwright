/**
 * Logger Utility
 * Centralized logging with colors and levels
 */

type LogLevel = 'debug' | 'info' | 'step' | 'success' | 'warning' | 'error';

class Logger {
  private static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };

  private isEnabled(level: LogLevel): boolean {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const levels: LogLevel[] = ['debug', 'info', 'step', 'success', 'warning', 'error'];
    const currentLevelIndex = levels.indexOf(logLevel as LogLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  debug(message: string, data?: any): void {
    if (!this.isEnabled('debug')) return;
    console.log(`${Logger.colors.dim}[DEBUG]${Logger.colors.reset} ${message}`, data || '');
  }

  info(message: string, data?: any): void {
    if (!this.isEnabled('info')) return;
    console.log(`${Logger.colors.blue}[INFO]${Logger.colors.reset} ${message}`, data || '');
  }

  step(message: string, details?: string): void {
    if (!this.isEnabled('step')) return;
    const detailsStr = details ? ` (${details})` : '';
    console.log(`${Logger.colors.cyan}▶ ${message}${Logger.colors.reset}${detailsStr}`);
  }

  success(message: string, data?: any): void {
    if (!this.isEnabled('success')) return;
    console.log(`${Logger.colors.green}✓ ${message}${Logger.colors.reset}`, data || '');
  }

  warning(message: string, data?: any): void {
    if (!this.isEnabled('warning')) return;
    console.warn(`${Logger.colors.yellow}[WARNING]${Logger.colors.reset} ${message}`, data || '');
  }

  error(message: string, error?: Error | any): void {
    if (!this.isEnabled('error')) return;
    console.error(`${Logger.colors.red}[ERROR]${Logger.colors.reset} ${message}`);
    if (error) {
      console.error(error);
    }
  }
}

export const logger = new Logger();

