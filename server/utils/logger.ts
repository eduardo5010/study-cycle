/**
 * Simple structured logger
 * In production, consider using a proper logging library like winston or pino
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

function formatLog(level: LogLevel, message: string, meta?: Record<string, any>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    const entry = formatLog("info", message, meta);
    console.log(JSON.stringify(entry));
  },

  warn(message: string, meta?: Record<string, any>) {
    const entry = formatLog("warn", message, meta);
    console.warn(JSON.stringify(entry));
  },

  error(message: string, error?: Error | unknown, meta?: Record<string, any>) {
    const entry = formatLog("error", message, {
      ...meta,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
    console.error(JSON.stringify(entry));
  },

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV === "development") {
      const entry = formatLog("debug", message, meta);
      console.debug(JSON.stringify(entry));
    }
  },
};

