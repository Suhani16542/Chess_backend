import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
};
