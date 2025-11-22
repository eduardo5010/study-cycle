import { logger } from "./logger";

/**
 * Custom error classes for better error handling
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

/**
 * Async error handler wrapper for Express routes
 */
export function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<any>
) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error handler middleware
 */
export function errorHandler(err: any, req: any, res: any, next: any) {
  // Log error
  logger.error("Request error", err, {
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
  });

  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(isDevelopment && { stack: err.stack, details: err }),
    });
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message =
    statusCode === 500 && !isDevelopment
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
}

