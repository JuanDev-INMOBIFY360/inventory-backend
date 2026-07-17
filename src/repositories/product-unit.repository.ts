import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { ProductUnit } from "../entities/ProductUnit";

export class ProductUnitRepository {
    private repo: Repository<ProductUnit>;

    constructor() {
        this.repo = AppDataSource.getRepository(ProductUnit);
    }

    async findAll(): Promise<ProductUnit[]> {
        return this.repo.find({
            relations: {
                product: true,
                client: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findAvailable(): Promise<ProductUnit[]> {
        return this.repo.find({
            where: { isSold: false },
            relations: {
                product: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findSold(): Promise<ProductUnit[]> {
        return this.repo.find({
            where: { isSold: true },
            relations: {
                product: true,
                client: true,
            },
            order: { saleDate: "DESC" },
        });
    }

    async findByProduct(productId: string): Promise<ProductUnit[]> {
        return this.repo.find({
            where: { productId },
            relations: {
                product: true,
                client: true,
            },
            order: { createdAt: "DESC" },
        });
    }

    async findBySerial(serial: string): Promise<ProductUnit | null> {
        return this.repo.findOne({
            where: { serial },
            relations: {
                product: true,
                client: true,
            },
        });
    }

    async findById(id: string): Promise<ProductUnit | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                product: true,
                client: true,
            },
        });
    }

    async findByIdOrFail(id: string): Promise<ProductUnit> {
        const unit = await this.findById(id);
        if (!unit) {
            throw new Error(`Unidad con ID ${id} no encontrada`);
        }
        return unit;
    }

    async create(data: Partial<ProductUnit>): Promise<ProductUnit> {
        const unit = this.repo.create(data);
        return this.repo.save(unit);
    }

    async createBulk(data: Partial<ProductUnit>[]): Promise<ProductUnit[]> {
        const units = this.repo.create(data);
        return this.repo.save(units);
    }

    async update(id: string, data: Partial<ProductUnit>): Promise<ProductUnit> {
        const unit = await this.findByIdOrFail(id);
        Object.assign(unit, data);
        return this.repo.save(unit);
    }

    async markAsSold(
        id: string,
        clientId: string,
        salePrice: number,
        saleDate: Date
    ): Promise<ProductUnit> {
        const unit = await this.findByIdOrFail(id);
        unit.isSold = true;
        unit.clientId = clientId;
        unit.salePrice = salePrice;
        unit.saleDate = saleDate;
        return this.repo.save(unit);
    }

   
    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    async existsBySerial(serial: string, excludeId?: string): Promise<boolean> {
        const query = this.repo.createQueryBuilder("unit")
            .where("unit.serial = :serial", { serial });
        
        if (excludeId) {
            query.andWhere("unit.id != :excludeId", { excludeId });
        }
        
        const count = await query.getCount();
        return count > 0;
    }
}