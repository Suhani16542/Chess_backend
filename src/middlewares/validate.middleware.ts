import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

/**
 * Middleware factory: validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (coerced + trimmed) data.
 * On failure, throws a 400 ApiError with structured field-level errors.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(ApiError.badRequest("Validation failed", errors));
    }

    req.body = result.data;
    next();
  };
