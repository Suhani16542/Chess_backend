import "express-async-errors";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { apiLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import apiRoutes from "./routes/index";

const createApp = (): Application => {
  const app: Application = express();

  // ─── Security ───────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // ─── CORS ────────────────────────────────────────────────────────────
  const allowedOrigins = env.isProd()
    ? (process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean)
    : ["http://localhost:3000", "http://localhost:3001"];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., Postman, mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: Origin '${origin}' not allowed`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // ─── Request Parsing ─────────────────────────────────────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  // ─── Compression ─────────────────────────────────────────────────────
  app.use(compression());

  // ─── Logging ─────────────────────────────────────────────────────────
  if (env.isDev()) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // ─── Global Rate Limiter ─────────────────────────────────────────────
  app.use("/api", apiLimiter);

  // ─── API Routes ──────────────────────────────────────────────────────
  app.use("/api", apiRoutes);

  // ─── 404 Handler ─────────────────────────────────────────────────────
  app.use(notFound);

  // ─── Global Error Handler ────────────────────────────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
