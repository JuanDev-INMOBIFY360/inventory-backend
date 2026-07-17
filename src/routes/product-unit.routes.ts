import { Router } from "express";
import { ProductUnitController } from "../controllers/product-unit.controller";
import { validate } from "../middlewares/validate";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
    CreateProductUnitDto,
    BulkCreateProductUnitDto,
    UpdateProductUnitDto,
    ProductUnitIdParamsDto,
    SellProductUnitDto,
} from "../dtos/product-unit.dto";

const router = Router();
const controller = new ProductUnitController();

// Rutas públicas (solo consulta)
router.get("/", controller.getAll);
router.get("/available", controller.getAvailable);
router.get("/sold", controller.getSold);
router.get("/product/:productId", controller.getByProduct);
router.get("/serial/:serial", controller.getBySerial);
router.get("/:id", validate(ProductUnitIdParamsDto, "params"), controller.getById);

//  Rutas protegidas (admin)
router.post(
    "/",
    authenticate,
    isAdmin,
    validate(CreateProductUnitDto, "body"),
    controller.create
);

router.post(
    "/bulk",
    authenticate,
    isAdmin,
    validate(BulkCreateProductUnitDto, "body"),
    controller.createBulk
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    validate(ProductUnitIdParamsDto, "params"),
    validate(UpdateProductUnitDto, "body"),
    controller.update
);

router.patch(
    "/:id/sell",
    authenticate,
    // isAdmin, // Puede ser solo admin o vendedor
    validate(ProductUnitIdParamsDto, "params"),
    validate(SellProductUnitDto, "body"),
    controller.sell
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    validate(ProductUnitIdParamsDto, "params"),
    controller.delete
);

export default router;