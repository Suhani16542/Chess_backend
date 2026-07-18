import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

const secureMode = env.SMTP_SECURE || env.SMTP_PORT === 465;
const requireTls = env.SMTP_REQUIRE_TLS || env.SMTP_PORT === 587;

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: secureMode,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  connectionTimeout: env.SMTP_CONNECTION_TIMEOUT,
  greetingTimeout: env.SMTP_GREETING_TIMEOUT,
  socketTimeout: env.SMTP_SOCKET_TIMEOUT,
  requireTLS: requireTls,
  tls: {
    rejectUnauthorized: env.SMTP_REJECT_UNAUTHORIZED,
  },
});

export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info(
      `[SMTP] Connection successful. Host: ${env.SMTP_HOST}; Port: ${env.SMTP_PORT}; Secure: ${String(secureMode)}; NodeEnv: ${env.NODE_ENV}`
    );
    return true;
  } catch (error) {
    const smtpError = error as Error & {
      code?: string;
      command?: string;
      response?: unknown;
    };

    const responseText =
      typeof smtpError.response === "string"
        ? smtpError.response
        : smtpError.response
          ? JSON.stringify(smtpError.response)
          : "n/a";

    const errorMessage = [
      `[SMTP] Connection failed.`,
      `Host: ${env.SMTP_HOST}`,
      `Port: ${env.SMTP_PORT}`,
      `Secure: ${String(secureMode)}`,
      `NodeEnv: ${env.NODE_ENV}`,
      `code: ${smtpError.code ?? "unknown"}`,
      `command: ${smtpError.command ?? "unknown"}`,
      `response: ${responseText}`,
    ].join(" | ");

    logger.error(errorMessage);
    if (smtpError.stack) {
      console.error(smtpError.stack);
    }

    return false;
  }
};
