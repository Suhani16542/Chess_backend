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

export const env = {
  PORT: parseInt(getEnv("PORT", false) || "5000", 10),
  MONGODB_URI: getEnv("MONGODB_URI"),
  SMTP_HOST: getEnv("SMTP_HOST"),
  SMTP_PORT: parseInt(getEnv("SMTP_PORT"), 10),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
  ACADEMY_EMAIL: getEnv("ACADEMY_EMAIL"),
  NODE_ENV: getEnv("NODE_ENV", false) || "development",
  isDev(): boolean {
    return this.NODE_ENV === "development";
  },
  isProd(): boolean {
    return this.NODE_ENV === "production";
  },
};
