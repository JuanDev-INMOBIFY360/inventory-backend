import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";


export class AuthController {
    private authService : AuthService;

    constructor(){
        this.authService = new AuthService();
    }

    register = async (
        req: Request<{}, {}, RegisterDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.authService.create(req.body);
            res.status(201).json({
                message: "Usuario registrado exitosamente",
                user,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (
        req: Request<{}, {}, LoginDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { user, token } = await this.authService.login(req.body);
            res.json({
                message: "Login exitoso",
                user,
                token,
            });
        } catch (error) {
            next(error);
        }
    };

     getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: "No autenticado" });
                return;
            }

            const user = await this.authService.getUserById(req.user.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };
}