import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false,
  },
});

export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info(
      `[SMTP] Connection successful. Host: ${process.env.SMTP_HOST}; Port: 587; Secure: false; NodeEnv: ${env.NODE_ENV}`
    );
    return true;
  } catch (error) {
    const smtpError = error as Error & {
      code?: string;
      command?: string;
      response?: unknown;
      syscall?: string;
      address?: string;
    };

    const responseText =
      typeof smtpError.response === "string"
        ? smtpError.response
        : smtpError.response
          ? JSON.stringify(smtpError.response)
          : "n/a";

    const errorMessage = [
      `[SMTP] Connection failed.`,
      `Host: ${process.env.SMTP_HOST}`,
      `Port: 587`,
      `Secure: false`,
      `NodeEnv: ${env.NODE_ENV}`,
      `message: ${smtpError.message}`,
      `code: ${smtpError.code ?? "unknown"}`,
      `syscall: ${smtpError.syscall ?? "unknown"}`,
      `address: ${smtpError.address ?? "unknown"}`,
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

