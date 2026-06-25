import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

// Not Found
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};



// Global Error Handler
export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });
};