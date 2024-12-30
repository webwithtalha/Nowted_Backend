// src/middleware/errorHandler.ts
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // 1) Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors.map((zodIssue) => ({
        path: zodIssue.path.join("."),
        message: zodIssue.message,
      })),
    });
  }

  // 2) Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 3) Handle any other or unknown errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
