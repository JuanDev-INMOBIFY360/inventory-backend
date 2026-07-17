import { MovementRepository } from "../repositories/movement.repository";
import { ProductUnitRepository } from "../repositories/product-unit.repository";
import { UserRepository } from "../repositories/user.repository";
import { Movement } from "../entities/Movement";
import { CreateMovementDto } from "../dtos/movement.dto";

export class MovementService {
    private movementRepo: MovementRepository;
    private unitRepo: ProductUnitRepository;
    private userRepo: UserRepository;

    constructor() {
        this.movementRepo = new MovementRepository();
        this.unitRepo = new ProductUnitRepository();
        this.userRepo = new UserRepository();
    }

    // Crear movimiento
    async createMovement(
        createDto: CreateMovementDto,
        userId: string
    ): Promise<Movement> {
        // Validar unidad
        const unit = await this.unitRepo.findById(createDto.unitId);
        if (!unit) {
            throw new Error(`Unidad con ID ${createDto.unitId} no encontrada`);
        }

        // Validar usuario
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error(`Usuario con ID ${userId} no encontrado`);
        }

        // Validaciones según tipo
        if (createDto.type === "SALE" && !unit.isSold) {
            throw new Error(`La unidad ${unit.serial} no está vendida`);
        }

        if (createDto.type === "RETURN" && !unit.isSold) {
            throw new Error(`Solo se pueden devolver unidades vendidas`);
        }

        return this.movementRepo.create({
            ...createDto,
            userId,
        });
    }

    // Obtener todos los movimientos
    async getAllMovements(): Promise<Movement[]> {
        return this.movementRepo.findAll();
    }

    // Obtener movimientos por unidad
    async getMovementsByUnit(unitId: string): Promise<Movement[]> {
        return this.movementRepo.findByUnit(unitId);
    }

    // Obtener movimientos por usuario
    async getMovementsByUser(userId: string): Promise<Movement[]> {
        return this.movementRepo.findByUser(userId);
    }

    // Obtener movimiento por ID
    async getMovementById(id: string): Promise<Movement> {
        return this.movementRepo.findByIdOrFail(id);
    }

    // Eliminar movimiento
    async deleteMovement(id: string): Promise<void> {
        await this.movementRepo.delete(id);
    }
}