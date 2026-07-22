import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2587,
  secure: false,
  auth: {
    user: env.BREVO_USER,
    pass: env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info(
      `[SMTP] Connection successful. Host: smtp-relay.brevo.com; Port: 2587; Secure: false; NodeEnv: ${env.NODE_ENV}`
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
      `Host: smtp-relay.brevo.com`,
      `Port: 2587`,
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