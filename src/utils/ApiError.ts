export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown[];

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown[],
    isOperational = true
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: unknown[]): ApiError {
    return new ApiError(400, message, errors);
  }

  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error"): ApiError {
    return new ApiError(500, message, undefined, false);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = "Too many requests, please try again later"): ApiError {
    return new ApiError(429, message);
  }
}
