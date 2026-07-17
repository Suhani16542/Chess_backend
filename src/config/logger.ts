import { env } from "./env";

type LogLevel = "info" | "warn" | "error" | "debug";

const colors: Record<LogLevel, string> = {
  info: "\x1b[36m",   // Cyan
  warn: "\x1b[33m",   // Yellow
  error: "\x1b[31m",  // Red
  debug: "\x1b[35m",  // Magenta
};
const reset = "\x1b[0m";

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  const levelTag = `[${level.toUpperCase()}]`;
  return `${color}${timestamp} ${levelTag}${reset} ${message}`;
};

export const logger = {
  info: (message: string): void => {
    console.log(formatMessage("info", message));
  },
  warn: (message: string): void => {
    console.warn(formatMessage("warn", message));
  },
  error: (message: string, error?: unknown): void => {
    console.error(formatMessage("error", message));
    if (error && env.isDev()) {
      console.error(error);
    }
  },
  debug: (message: string): void => {
    if (env.isDev()) {
      console.debug(formatMessage("debug", message));
    }
  },
};
