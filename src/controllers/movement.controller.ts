import { Request, Response, NextFunction } from "express";
import { MovementService } from "../services/movement.service";
import { MovementMapper } from "../mappers/movement.mapper";
import { CreateMovementDto, MovementIdParamsDto } from "../dtos/movement.dto";

export class MovementController {
    private movementService: MovementService;

    constructor() {
        this.movementService = new MovementService();
    }

    // Crear movimiento
    create = async (
        req: Request<{}, {}, CreateMovementDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const movement = await this.movementService.createMovement(
                req.body,
                userId
            );
            const response = MovementMapper.toResponse(movement);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar todos los movimientos
    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const movements = await this.movementService.getAllMovements();
            const response = MovementMapper.toResponseList(movements);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar movimientos por unidad
    getByUnit = async (
        req: Request<{ unitId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { unitId } = req.params;
            const movements = await this.movementService.getMovementsByUnit(unitId);
            const response = MovementMapper.toResponseList(movements);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar movimientos por usuario
    getByUser = async (
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { userId } = req.params;
            const movements = await this.movementService.getMovementsByUser(userId);
            const response = MovementMapper.toResponseList(movements);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener movimiento por ID
    getById = async (
        req: Request<MovementIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const movement = await this.movementService.getMovementById(id);
            const response = MovementMapper.toResponse(movement);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Eliminar movimiento
    delete = async (
        req: Request<MovementIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.movementService.deleteMovement(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}