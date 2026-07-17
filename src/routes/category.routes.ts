// 📁 src/routes/category.routes.ts
import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate";
import { CreateCategoryDto, UpdateCategoryDto, CategoryIdParamsDto } from "../dtos/category.dto";

const router = Router();
const controller = new CategoryController();



// POST /api/categories - Crear categoría
router.post(
    "/",
    validate(CreateCategoryDto, "body"),
    controller.create
);

// GET /api/categories - Listar todas las categorías
router.get(
    "/",
    controller.getAll
);

// GET /api/categories/active - Listar categorías activas
router.get(
    "/active",
    controller.getActive
);

// GET /api/categories/:id - Obtener categoría por ID
router.get(
    "/:id",
    validate(CategoryIdParamsDto, "params"),
    controller.getById
);

// PUT /api/categories/:id - Actualizar categoría
router.put(
    "/:id",
    validate(CategoryIdParamsDto, "params"),
    validate(UpdateCategoryDto, "body"),
    controller.update
);

// PATCH /api/categories/:id/toggle-status - Cambiar estado
router.patch(
    "/:id/toggle-status",
    validate(CategoryIdParamsDto, "params"),
    controller.toggleStatus
);

// DELETE /api/categories/:id - Eliminar categoría
router.delete(
    "/:id",
    validate(CategoryIdParamsDto, "params"),
    controller.delete
);

export default router;