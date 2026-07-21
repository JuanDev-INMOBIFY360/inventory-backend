import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import logger from "../utils/logger";

const authService = new AuthService();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = async (req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const authHeaders = req.headers.authorization;
     
        
        if (!authHeaders || !authHeaders.startsWith("Bearer")) {
            res.status(401).json({ error: "Token no proporcionado" });
            return;
        }
        
        const token = authHeaders.split(" ")[1];
        
       
        
        const decoded = authService.verifyToken(token);
        
  
        
        req.user = decoded;
        next();
    } catch (error) {
        logger.error("Error en authenticate:", error);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "No autenticado" });
            return;
        }
        const user = await authService.getUserById(req.user.id);
        if (user.role != "admin") {
            res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador" });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Error al verificar permisos" });
    }
}