import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected.");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected gracefully.");
};
