import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();
const controller = new DashboardController();

// odas las rutas requieren autenticación
router.get("/stats", authenticate, controller.getStats);
router.get("/top-selling", authenticate, controller.getTopSelling);
router.get("/recent-movements", authenticate, controller.getRecentMovements);

export default router;