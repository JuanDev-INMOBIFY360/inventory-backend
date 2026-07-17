// 📁 src/middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidateTarget = "body" | "params" | "query";

/**
 * Middleware para validar datos con Zod
 */
export function validate(
    schema: z.ZodTypeAny,
    target: ValidateTarget = "body"
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req[target]);

         
            if (target === "query") {
                Object.defineProperty(req, "query", {
                    value: validated,
                    writable: true,
                    configurable: true,
                });
            } else {
                req[target] = validated;
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: "Error de validación",
                    details: error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                        code: issue.code,
                    })),
                });
            } else {
                next(error);
            }
        }
    };
}