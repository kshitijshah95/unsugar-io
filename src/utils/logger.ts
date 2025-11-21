/**
 * Logger Utility
 * Provides environment-aware logging with future support for error tracking services
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger class with environment-aware logging
 */
class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Log info message (development only)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`ℹ️ ${message}`, context || '');
    }
  }

  /**
   * Log warning message (development only)
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, context || '');
    }
  }

  /**
   * Log error message
   * In production, this should send to error tracking service (Sentry, LogRocket)
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(`❌ ${message}`, error || '', context || '');
    } else {
      // TODO: Send to error tracking service in production
      // Example: Sentry.captureException(error, { extra: { message, ...context } });
      console.error(message); // Minimal logging in production
    }
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`🔍 ${message}`, context || '');
    }
  }

  /**
   * Log API request (development only)
   */
  apiRequest(method: string, url: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.log(`🌐 [API Request] ${method} ${url}`, data || '');
    }
  }

  /**
   * Log API response (development only)
   */
  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    if (this.isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '✅' : '❌';
      console.log(`${emoji} [API Response] ${method} ${url} - ${status}`, data || '');
    }
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: unknown, context?: LogContext): void {
    this.error(`API Error: ${method} ${url}`, error, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Named exports for convenience
export const {
  info,
  warn,
  error,
  debug,
  apiRequest,
  apiResponse,
  apiError
} = logger;
