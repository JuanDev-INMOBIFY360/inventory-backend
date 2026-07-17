
import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
    CreateProductDto,
    UpdateProductDto,
    ProductIdParamsDto,
} from "../dtos/product.dto";

const router = Router();
const controller = new ProductController();


router.get("/", controller.getAll);
router.get("/:id", validate(ProductIdParamsDto, "params"), controller.getById);


router.post(
    "/",
    authenticate,
    isAdmin,
    validate(CreateProductDto, "body"),
    controller.create
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    validate(ProductIdParamsDto, "params"),
    validate(UpdateProductDto, "body"),
    controller.update
);

router.patch(
    "/:id/toggle-status",
    authenticate,
    isAdmin,
    validate(ProductIdParamsDto, "params"),
    controller.toggleStatus
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    validate(ProductIdParamsDto, "params"),
    controller.delete
);

export default router;