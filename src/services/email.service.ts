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
  const { to, subject, html } = options;

  const recipients = typeof to === "string"
    ? to.split(",").map((email) => ({ email: email.trim() }))
    : to.map((email) => ({ email: email.trim() }));

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": env.BREVO_SMTP_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Chess Academy",
          email: env.BREVO_USER,
        },
        to: recipients,
        subject,
        htmlContent: html,
      }),
    });

    const data = (await response.json()) as { messageId?: string; message?: string };

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    logger.info(`[EmailService] Email sent successfully. MessageId: ${data.messageId}`);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    const error = err as Error;
    logger.error(`[EmailService] Brevo API send failed. message: ${error.message}`, err);
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


