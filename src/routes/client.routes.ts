import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { validate } from "../middlewares/validate";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
    CreateClientDto,
    UpdateClientDto,
    ClientIdParamsDto,
} from "../dtos/client.dto";

const router = Router();
const controller = new ClientController();

router.get("/", controller.getAll);
router.get("/search", controller.search);
router.get("/:id", validate(ClientIdParamsDto, "params"), controller.getById);

router.post(
    "/",
    authenticate,
    isAdmin,
    validate(CreateClientDto, "body"),
    controller.create
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    validate(ClientIdParamsDto, "params"),
    validate(UpdateClientDto, "body"),
    controller.update
);

router.patch(
    "/:id/toggle-status",
    authenticate,
    isAdmin,
    validate(ClientIdParamsDto, "params"),
    controller.toggleStatus
);

router.delete(
    "/:id",
    authenticate,
    isAdmin,
    validate(ClientIdParamsDto, "params"),
    controller.delete
);

export default router;