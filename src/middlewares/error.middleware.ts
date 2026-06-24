import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';
import { env } from '../config/env';

/**
 * Centralized error handler. All controllers/services throw ApiError
 * (or let errors bubble via asyncHandler), and this is the single place
 * that shapes the HTTP error response.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known, intentional application errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Sequelize unique constraint violations (e.g. duplicate email)
  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
      details: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
    return;
  }

  // Sequelize model-level validation errors
  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
    return;
  }

  // JSON body parse errors from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ success: false, message: 'Malformed JSON in request body' });
    return;
  }

  // Fallback: unexpected error
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
