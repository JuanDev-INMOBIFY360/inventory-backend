import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Category } from "../entities/Category";

export class CategoryRepository {
    private repo: Repository<Category>;

    constructor() {
        this.repo = AppDataSource.getRepository(Category);
    }

    // Obtener todas las categorías
    async findAll(): Promise<Category[]> {
        return this.repo.find({
            order: { name: "ASC" }
        });
    }

    // Obtener solo categorías activas
    async findActive(): Promise<Category[]> {
        return this.repo.find({
            where: { isActive: true },
            order: { name: "ASC" }
        });
    }

    // Buscar por ID
    async findById(id: string): Promise<Category | null> {
        return this.repo.findOne({ where: { id } });
    }

    // Buscar por ID o lanzar error
    async findByIdOrFail(id: string): Promise<Category> {
        const category = await this.findById(id);
        if (!category) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }
        return category;
    }

    // Buscar por nombre
    async findByName(name: string): Promise<Category | null> {
        return this.repo.findOne({ 
            where: { name } 
        });
    }

    // Crear categoría
    async create(data: Partial<Category>): Promise<Category> {
        const category = this.repo.create(data);
        return this.repo.save(category);
    }

    // Actualizar categoría
    async update(id: string, data: Partial<Category>): Promise<Category> {
        const category = await this.findByIdOrFail(id);
        Object.assign(category, data);
        return this.repo.save(category);
    }

    // Eliminar categoría (borrado físico)
    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    // Verificar si existe una categoría con el mismo nombre
    async existsByName(name: string, excludeId?: string): Promise<boolean> {
        const query = this.repo.createQueryBuilder("category")
            .where("LOWER(category.name) = LOWER(:name)", { name });
        
        if (excludeId) {
            query.andWhere("category.id != :excludeId", { excludeId });
        }
        
        const count = await query.getCount();
        return count > 0;
    }
}