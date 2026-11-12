import type {  NextFunction,  Request,  Response} from 'express';

import AppError from '../utils/AppError.js';

const errorMiddleware = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Internal server error";

  let errors;
  if (err instanceof AppError && err.details) {
    errors = err.details
  }

  return res.status(statusCode).json({
    success: false,
    status: err instanceof AppError ? err.status : "error",
    message,
    errors
  });
};

export default errorMiddleware;
