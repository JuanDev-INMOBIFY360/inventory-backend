// 📁 src/routes/movement.routes.ts
import { Router } from "express";
import { MovementController } from "../controllers/movement.controller";
import { validate } from "../middlewares/validate";
import { authenticate, isAdmin } from "../middlewares/auth";
import { CreateMovementDto, MovementIdParamsDto } from "../dtos/movement.dto";

const router = Router();
const controller = new MovementController();

// Rutas públicas (solo consulta)
router.get("/", controller.getAll);
router.get("/unit/:unitId", controller.getByUnit);
router.get("/user/:userId", controller.getByUser);
router.get("/:id", validate(MovementIdParamsDto, "params"), controller.getById);

// Rutas protegidas (autenticado)
router.post(
    "/",
    authenticate,
    validate(CreateMovementDto, "body"),
    controller.create
);

// Rutas protegidas (solo admin)
router.delete(
    "/:id",
    authenticate,
    isAdmin,
    validate(MovementIdParamsDto, "params"),
    controller.delete
);

export default router;