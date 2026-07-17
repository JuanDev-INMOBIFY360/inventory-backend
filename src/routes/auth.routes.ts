import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(RegisterDto, "body"), controller.register);

router.post("/login",validate(LoginDto, "body"),controller.login);

router.get("/profile",authenticate,controller.getProfile);

export default router;