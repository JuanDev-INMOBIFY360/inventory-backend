import { CategoryRepository } from "../repositories/category.repository";
import { Category } from "../entities/Category";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

export class CategoryService {
    private categoryRepo: CategoryRepository;

    constructor() {
        this.categoryRepo = new CategoryRepository();
    }

    // Crear categoría
    async createCategory(createDto: CreateCategoryDto): Promise<Category> {
        // Validar que no exista otra con el mismo nombre
        const exists = await this.categoryRepo.existsByName(createDto.name);
        if (exists) {
            throw new Error(`Ya existe una categoría con el nombre "${createDto.name}"`);
        }

        return this.categoryRepo.create(createDto);
    }

    // Obtener todas las categorías
    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepo.findAll();
    }

    // Obtener categorías activas
    async getActiveCategories(): Promise<Category[]> {
        return this.categoryRepo.findActive();
    }

    // Obtener categoría por ID
    async getCategoryById(id: string): Promise<Category> {
        return this.categoryRepo.findByIdOrFail(id);
    }

    // Actualizar categoría
    async updateCategory(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
        // Si se actualiza el nombre, validar que no exista otro con ese nombre
        if (updateDto.name) {
            const exists = await this.categoryRepo.existsByName(updateDto.name, id);
            if (exists) {
                throw new Error(`Ya existe una categoría con el nombre "${updateDto.name}"`);
            }
        }

        return this.categoryRepo.update(id, updateDto);
    }

    // Eliminar categoría (soft delete o físico)
    async deleteCategory(id: string): Promise<void> {
        // Opcional: Verificar si la categoría tiene productos antes de eliminar
        // Si tiene productos, no permitir eliminar (lanzar error)
        await this.categoryRepo.delete(id);
    }

    // Cambiar estado (activar/desactivar)
    async toggleCategoryStatus(id: string): Promise<Category> {
        const category = await this.categoryRepo.findByIdOrFail(id);
        category.isActive = !category.isActive;
        return this.categoryRepo.update(id, { isActive: category.isActive });
    }
}