/**
 * Structured logging system for the application
 * Replaces console.* with proper log levels and context
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
  error?: Error;
  source?: string;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = this.getLogLevelFromEnv();
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.EXPO_PUBLIC_LOG_LEVEL;
    switch (envLevel?.toUpperCase()) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any, error?: Error, source?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      source: source || this.getCallerInfo(),
    };
  }

  private getCallerInfo(): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';
    
    const lines = stack.split('\n');
    // Skip the current function and find the first meaningful caller
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      if (line && !line.includes('Logger.') && !line.includes('at ')) {
      const match = line.match(/at\s+(.+?)\s+\(/);
      return match?.[1] || line.trim();
      }
    }
    return 'unknown';
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // Add to in-memory logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Format and output to console
    const formattedMessage = this.formatLog(entry);
    
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.log(formattedMessage);
        break;
    }
  }

  private formatLog(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.source ? `[${entry.source}]` : '',
      entry.message,
    ].filter(Boolean);

    let formatted = parts.join(' ');

    if (entry.context) {
      formatted += `\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }

    if (entry.error) {
      formatted += `\nError: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * Log error message
   */
  static error(message: string, error?: Error | any, context?: any): void {
    const logger = Logger.getInstance();
    const logError = error instanceof Error ? error : new Error(String(error));
    const entry = logger.createLogEntry(LogLevel.ERROR, message, context, logError);
    logger.log(entry);
  }

  /**
   * Log warning message
   */
  static warn(message: string, context?: any): void {
    const logger = Logger.getInstance();
    const entry = logger.createLogEntry(LogLevel.WARN, message, context);
    logger.log(entry);
  }

  /**
   * Log info message
   */
  static info(message: string, context?: any): void {
    const logger = Logger.getInstance();
    const entry = logger.createLogEntry(LogLevel.INFO, message, context);
    logger.log(entry);
  }

  /**
   * Log debug message
   */
  static debug(message: string, context?: any): void {
    const logger = Logger.getInstance();
    const entry = logger.createLogEntry(LogLevel.DEBUG, message, context);
    logger.log(entry);
  }

  /**
   * Get singleton instance
   */
  private static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get all logs from memory
   */
  static getLogs(): LogEntry[] {
    return Logger.getInstance().logs;
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return Logger.getInstance().logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs from memory
   */
  static clearLogs(): void {
    Logger.getInstance().logs = [];
  }

  /**
   * Export logs as JSON string
   */
  static exportLogs(): string {
    return JSON.stringify(Logger.getInstance().logs, null, 2);
  }

  /**
   * Set log level dynamically
   */
  static setLogLevel(level: LogLevel): void {
    Logger.getInstance().logLevel = level;
  }

  /**
   * Get current log level
   */
  static getLogLevel(): LogLevel {
    return Logger.getInstance().logLevel;
  }
}

// Export convenience methods
export const logger = {
  error: Logger.error,
  warn: Logger.warn,
  info: Logger.info,
  debug: Logger.debug,
  getLogs: Logger.getLogs,
  getLogsByLevel: Logger.getLogsByLevel,
  clearLogs: Logger.clearLogs,
  exportLogs: Logger.exportLogs,
  setLogLevel: Logger.setLogLevel,
  getLogLevel: Logger.getLogLevel,
};

// Export types
export type { LogEntry };