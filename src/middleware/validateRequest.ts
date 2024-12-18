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
      // Explicitly validate req fields using type assertions
      schema.parse({
        body: req.body as Record<string, any> || {},
        query: req.query as Record<string, string | string[]> || {},
        params: req.params as Record<string, string> || {},
      });
      next();
    } catch (error) {
      // Cast error explicitly
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      // Fallback for other unknown errors
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default validateRequest;