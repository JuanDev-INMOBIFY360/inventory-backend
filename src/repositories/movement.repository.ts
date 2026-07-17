import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Movement } from "../entities/Movement";

export class MovementRepository {
    private repo: Repository<Movement>;

    constructor() {
        this.repo = AppDataSource.getRepository(Movement);
    }

    async findAll(): Promise<Movement[]> {
        return this.repo.find({
            relations: {
                unit: {
                    product: true,
                },
                user: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findByUnit(unitId: string): Promise<Movement[]> {
        return this.repo.find({
            where: { unitId },
            relations: {
                unit: {
                    product: true,
                },
                user: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findByUser(userId: string): Promise<Movement[]> {
        return this.repo.find({
            where: { userId },
            relations: {
                unit: {
                    product: true,
                },
                user: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findById(id: string): Promise<Movement | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                unit: {
                    product: true,
                },
                user: true,
            },
        });
    }

    async findByIdOrFail(id: string): Promise<Movement> {
        const movement = await this.findById(id);
        if (!movement) {
            throw new Error(`Movimiento con ID ${id} no encontrado`);
        }
        return movement;
    }

    async create(data: Partial<Movement>): Promise<Movement> {
        const movement = this.repo.create(data);
        return this.repo.save(movement);
    }

    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }
}