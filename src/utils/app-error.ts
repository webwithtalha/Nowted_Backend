export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Restore prototype chain
    Object.setPrototypeOf(this, AppError.prototype);

    // Optional: capture stack trace
    // (This is mostly helpful for debugging in large apps)
    Error.captureStackTrace(this, this.constructor);
  }
}
