import { transporter } from "../config/nodemailer";
import { env } from "../config/env";
import { logger } from "../config/logger";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const sendEmail = async (
  options: SendEmailOptions
): Promise<EmailResult> => {
  const { to, subject, html, replyTo } = options;

  try {
    const info = await transporter.sendMail({
      from: env.ACADEMY_EMAIL,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    logger.info(`[EmailService] Email sent successfully. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    const error = err as Error;
    logger.error(`[EmailService] SMTP error: ${error.message}`, err);
    return { success: false, error: error.message };
  }
};

export const sendAdminLeadEmail = async (
  to: string | string[],
  subject: string,
  html: string
): Promise<EmailResult> => sendEmail({ to, subject, html });

export const sendUserConfirmationEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<EmailResult> => sendEmail({ to, subject, html, replyTo });

