import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import { logger } from "./config/logger";
import createApp from "./app";
import { verifySmtpConnection } from "./config/nodemailer";

const startServer = async (): Promise<void> => {
  // Validate env variables before anything else
  const { PORT, NODE_ENV } = env;

  // Connect to MongoDB
  await connectDB();

  logger.info(
    `[SMTP] Preparing verification. Host: ${env.SMTP_HOST}; Port: ${env.SMTP_PORT}; Secure: ${String(env.SMTP_SECURE || env.SMTP_PORT === 465)}; NodeEnv: ${env.NODE_ENV}`
  );

  const smtpReady = await verifySmtpConnection();
  if (!smtpReady) {
    logger.warn("SMTP verification failed. Email delivery may be unavailable until the SMTP configuration is corrected.");
  }

  // Create and start Express app
  const app = createApp();
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} [${NODE_ENV}]`);
    logger.info(`📍 API Base: http://localhost:${PORT}/api`);
    logger.info(`❤️  Health:   http://localhost:${PORT}/api/health`);
  });

  // ─── Graceful Shutdown ───────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.warn(`${signal} received. Initiating graceful shutdown...`);

    server.close(async () => {
      logger.info("HTTP server closed.");
      await disconnectDB();
      logger.info("Graceful shutdown complete. Exiting.");
      process.exit(0);
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
      logger.error("Graceful shutdown timed out. Forcing exit.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // ─── Unhandled Rejection / Exception ────────────────────────────────
  process.on("unhandledRejection", (reason: unknown) => {
    logger.error(
      `Unhandled Rejection: ${reason instanceof Error ? reason.message : String(reason)}`
    );
    // Let the process crash — process manager (PM2) will restart it
    process.exit(1);
  });

  process.on("uncaughtException", (error: Error) => {
    logger.error(`Uncaught Exception: ${error.message}`, error);
    process.exit(1);
  });
};

startServer();
