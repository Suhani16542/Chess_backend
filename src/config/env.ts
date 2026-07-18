import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const getEnv = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? "";
};

const getBooleanEnv = (key: string, fallback = false): boolean => {
  const value = process.env[key];
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
};

const getNumberEnv = (key: string, fallback: number): number => {
  const value = process.env[key];
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  PORT: parseInt(getEnv("PORT", false) || "5000", 10),
  MONGODB_URI: getEnv("MONGODB_URI"),
  SMTP_HOST: getEnv("SMTP_HOST"),
  SMTP_PORT: parseInt(getEnv("SMTP_PORT"), 10),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
  ACADEMY_EMAIL: getEnv("ACADEMY_EMAIL"),
  NODE_ENV: getEnv("NODE_ENV", false) || "development",
  SMTP_SECURE: getBooleanEnv("SMTP_SECURE", false),
  SMTP_REQUIRE_TLS: getBooleanEnv("SMTP_REQUIRE_TLS", false),
  SMTP_REJECT_UNAUTHORIZED: getBooleanEnv("SMTP_REJECT_UNAUTHORIZED", true),
  SMTP_CONNECTION_TIMEOUT: getNumberEnv("SMTP_CONNECTION_TIMEOUT", 10000),
  SMTP_GREETING_TIMEOUT: getNumberEnv("SMTP_GREETING_TIMEOUT", 10000),
  SMTP_SOCKET_TIMEOUT: getNumberEnv("SMTP_SOCKET_TIMEOUT", 15000),
  isDev(): boolean {
    return this.NODE_ENV === "development";
  },
  isProd(): boolean {
    return this.NODE_ENV === "production";
  },
};
