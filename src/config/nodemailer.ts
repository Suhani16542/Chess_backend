import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

export const transporter = nodemailer.createTransport({
  // 1. Agar ENV mein Host set nahi hai toh Direct Brevo Host use karega
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Port 587 ke liye ALWAYS false
  auth: {
    // 2. BREVO_USER / BREVO_SMTP_KEY ko fallback diya gaya hai
    user: process.env.BREVO_USER || process.env.SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS,
  },
  // 3. Timeouts ko 30s se kam karke 10s kar diya gaya hai taaki lag na ho
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info(
      `[SMTP] Connection successful. Host: ${process.env.SMTP_HOST || "smtp-relay.brevo.com"}; Port: 587; NodeEnv: ${env.NODE_ENV}`
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
      `Host: ${process.env.SMTP_HOST || "smtp-relay.brevo.com"}`,
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