import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route/controller function so that any rejected promise
 * is forwarded to Express's error-handling middleware via next(err),
 * instead of needing a try/catch in every controller.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
