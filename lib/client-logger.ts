// lib/client-logger.ts - Client-side logging utility
/** biome-ignore-all lint/suspicious/noConsole: ignore console */
type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

interface LogPayload {
  level: LogLevel;
  message: string;
  error?: any;
  metadata?: Record<string, any>;
}

class ClientLogger {
  private async sendLog(payload: LogPayload) {
    try {
      await fetch('/api/shared/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Fallback to console if API fails
      console.error('Failed to send log to server:', error);
    }
  }
  error(message: string, error?: any, metadata?: Record<string, any>) {
    console.error(message, error, metadata);
    this.sendLog({
      level: 'ERROR',
      message,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      metadata,
    });
  }
  warn(message: string, metadata?: Record<string, any>) {
    console.warn(message, metadata);
    this.sendLog({
      level: 'WARN',
      message,
      metadata,
    });
  }
  info(message: string, metadata?: Record<string, any>) {
    console.info(message, metadata);
    this.sendLog({
      level: 'INFO',
      message,
      metadata,
    });
  }
  debug(message: string, metadata?: Record<string, any>) {
    console.debug(message, metadata);
    this.sendLog({
      level: 'DEBUG',
      message,
      metadata,
    });
  }
}

export const clientLogger = new ClientLogger();
