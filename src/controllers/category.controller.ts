import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { CategoryMapper } from "../mappers/category.mapper";
import { 
    CreateCategoryDto, 
    UpdateCategoryDto, 
    CategoryIdParamsDto 
} from "../dtos/category.dto";

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    // Crear categoría
    create = async (
        req: Request<{}, {}, CreateCategoryDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const category = await this.categoryService.createCategory(req.body);
            const response = CategoryMapper.toResponse(category);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener todas las categorías
    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const categories = await this.categoryService.getAllCategories();
            const response = CategoryMapper.toResponseList(categories);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener categorías activas
    getActive = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const categories = await this.categoryService.getActiveCategories();
            const response = CategoryMapper.toResponseList(categories);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener categoría por ID
    getById = async (
        req: Request<CategoryIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            const response = CategoryMapper.toResponse(category);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Actualizar categoría
    update = async (
        req: Request<CategoryIdParamsDto, {}, UpdateCategoryDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.updateCategory(id, req.body);
            const response = CategoryMapper.toResponse(category);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Eliminar categoría
    delete = async (
        req: Request<CategoryIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    // Cambiar estado (activar/desactivar)
    toggleStatus = async (
        req: Request<CategoryIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.toggleCategoryStatus(id);
            const response = CategoryMapper.toResponse(category);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };
}