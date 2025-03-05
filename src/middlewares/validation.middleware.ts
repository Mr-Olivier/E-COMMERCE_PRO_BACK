// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Run validations
    for (const validation of validations) {
      await validation.run(req);
    }

    // Check results
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    // Return errors
    res.status(400).json({
      status: "error",
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : "unknown",
        message: err.msg,
      })),
    });
  };
};
