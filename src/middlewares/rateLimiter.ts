import rateLimit from "express-rate-limit";

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

/**
 * Strict rate limiter for lead submission: 5 requests per hour per IP.
 * Prevents form spam abuse.
 */
export const demoLeadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "You have submitted too many demo requests. Please try again after 1 hour.",
  },
  skipSuccessfulRequests: false,
});
