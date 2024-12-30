import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod"; // ZodError for runtime
import type { ZodSchema } from "zod"; // ZodSchema for types

/**
 * Zod Validation Middleware
 * @param schema - Zod schema for validating request data
 */
const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: (req.body as Record<string, any>) || {},
        query: (req.query as Record<string, string | string[]>) || {},
        params: (req.params as Record<string, string>) || {},
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      // Fallback for other unknown errors
      return next(error);
    }
  };
};

export default validateRequest;
