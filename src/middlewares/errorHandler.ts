import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(" Error:", err);

    // Error de Zod (validación)
    if (err instanceof ZodError) {
        res.status(400).json({
            error: "Error de validación",
            details: err.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
                code: issue.code,
            })),
        });
        return;
    }

    // Error de TypeORM (entidad no encontrada)
    if (err.name === "EntityNotFound" || err.message?.includes("no encontrado")) {
        res.status(404).json({
            error: err.message || "Recurso no encontrado",
        });
        return;
    }

    // Error de autenticación
    if (err.message?.includes("token") || err.message?.includes("autenticado")) {
        res.status(401).json({
            error: err.message || "No autorizado",
        });
        return;
    }

    // Error de permisos
    if (err.message?.includes("permiso") || err.message?.includes("acceso")) {
        res.status(403).json({
            error: err.message || "Acceso denegado",
        });
        return;
    }

    // Error genérico
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};