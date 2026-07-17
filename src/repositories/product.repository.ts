import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";

export class ProductRepository {
    private repo: Repository<Product>;

    constructor() {
        this.repo = AppDataSource.getRepository(Product);
    }

    async findAll(): Promise<Product[]> {
        return this.repo.find({
            relations: {
                category: true, 
            },
            order: {
                name: "ASC",
            },
        });
    }

    async findById(id: string): Promise<Product | null> {
        return this.repo.findOne({
            where: { id },
            relations: {
                category: true, 
            },
        });
    }

    async findByIdOrFail(id: string): Promise<Product> {
        const product = await this.findById(id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }

    async create(data: Partial<Product>): Promise<Product> {
        const product = this.repo.create(data);
        return this.repo.save(product);
    }

    async update(id: string, data: Partial<Product>): Promise<Product> {
        const product = await this.findByIdOrFail(id);
        Object.assign(product, data);
        return this.repo.save(product);
    }

    
    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    async toggleStatus(id: string): Promise<Product> {
        const product = await this.findByIdOrFail(id);
        product.isActive = !product.isActive;
        return this.repo.save(product);
    }
}