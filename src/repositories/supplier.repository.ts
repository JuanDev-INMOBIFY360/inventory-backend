import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Supplier } from "../entities/Supplier";

export class SupplierRepository {
    private repo: Repository<Supplier>;

    constructor() {
        this.repo = AppDataSource.getRepository(Supplier);
    }

    async findAll(): Promise<Supplier[]> {
        return this.repo.find({
            order: { name: "ASC" },
        });
    }

    async findById(id: string): Promise<Supplier | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByIdOrFail(id: string): Promise<Supplier> {
        const supplier = await this.findById(id);
        if (!supplier) {
            throw new Error(`Proveedor con ID ${id} no encontrado`);
        }
        return supplier;
    }

    async create(data: Partial<Supplier>): Promise<Supplier> {
        const supplier = this.repo.create(data);
        return this.repo.save(supplier);
    }

    async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
        const supplier = await this.findByIdOrFail(id);
        Object.assign(supplier, data);
        return this.repo.save(supplier);
    }

    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    async toggleStatus(id: string): Promise<Supplier> {
        const supplier = await this.findByIdOrFail(id);
        supplier.isActive = !supplier.isActive;
        return this.repo.save(supplier);
    }
}