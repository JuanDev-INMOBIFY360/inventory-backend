// 📁 src/routes/supplier.routes.ts
import { Router } from "express";
import { SupplierController } from "../controllers/supplier.controller";
import { validate } from "../middlewares/validate";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
    CreateSupplierDto,
    UpdateSupplierDto,
    SupplierIdParamsDto,
} from "../dtos/supplier.dto";

const router = Router();
const controller = new SupplierController();

//  Rutas públicas (solo consulta)
router.get("/", controller.getAll);
router.get("/:id", validate(SupplierIdParamsDto, "params"), controller.getById);

// Rutas protegidas (solo admin)
router.post(
    "/",
    authenticate,
    isAdmin,
    validate(CreateSupplierDto, "body"),
    controller.create
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    validate(SupplierIdParamsDto, "params"),
    validate(UpdateSupplierDto, "body"),
    controller.update
);

router.patch(
    "/:id/toggle-status",
    authenticate,
    isAdmin,
    validate(SupplierIdParamsDto, "params"),
    controller.toggleStatus
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    validate(SupplierIdParamsDto, "params"),
    controller.delete
);

export default router;