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
  BREVO_USER: getEnv("BREVO_USER"),
  BREVO_SMTP_KEY: getEnv("BREVO_SMTP_KEY"),
  NOTIFICATION_EMAIL: getEnv("NOTIFICATION_EMAIL"),
  NODE_ENV: getEnv("NODE_ENV", false) || "development",
  isDev(): boolean {
    return this.NODE_ENV === "development";
  },
  isProd(): boolean {
    return this.NODE_ENV === "production";
  },
  // Backward compatibility getters for logs and internal calls
  get SMTP_HOST(): string {
    return "smtp-relay.brevo.com";
  },
  get SMTP_PORT(): number {
    return 587;
  },
  get SMTP_SECURE(): boolean {
    return false;
  },
  get ACADEMY_EMAIL(): string {
    return this.NOTIFICATION_EMAIL;
  },
};
