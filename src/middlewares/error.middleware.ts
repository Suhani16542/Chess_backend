import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";
import { env } from "../config/env";

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown[];
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[ErrorHandler] ${err.message}`, err);

  // Handle known operational API errors
  if (err instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    };

    if (env.isDev()) {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === "MongoServerError" && (err as any).code === 11000) {
    const response: ErrorResponse = {
      success: false,
      statusCode: 409,
      message: "Duplicate entry. A record with this data already exists.",
    };
    res.status(409).json(response);
    return;
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    const response: ErrorResponse = {
      success: false,
      statusCode: 400,
      message: "Validation error",
      errors: Object.values((err as any).errors).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    };
    res.status(400).json(response);
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const response: ErrorResponse = {
      success: false,
      statusCode: 400,
      message: `Invalid value for field: ${(err as any).path}`,
    };
    res.status(400).json(response);
    return;
  }

  // Fallback: unhandled/unknown error
  const response: ErrorResponse = {
    success: false,
    statusCode: 500,
    message: env.isProd() ? "Internal server error" : err.message,
  };

  if (env.isDev()) {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
