// 📁 src/app.ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";

// Importar rutas
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import productUnitRoutes from "./routes/product-unit.routes";
import clientRoutes from "./routes/client.routes";
import movementRoutes from "./routes/movement.routes";
import supplierRoutes from "./routes/supplier.routes";
import dashboardRoutes from "./routes/dashboard.routes";

import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "3000";
        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true,
        }));
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.app.get("/health", (_req, res) => {
            res.json({
                status: "OK",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: AppDataSource.isInitialized ? "connected" : "disconnected",
            });
        });
   
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/categories", categoryRoutes);
        this.app.use("/api/products", productRoutes);
        this.app.use("/api/product-units", productUnitRoutes);
        this.app.use("/api/clients", clientRoutes);
        this.app.use("/api/movements", movementRoutes);
        this.app.use("/api/suppliers", supplierRoutes);
        this.app.use("/api/dashboard", dashboardRoutes);

        this.app.use((req, res) => {
            res.status(404).json({
                error: "Ruta no encontrada",
                path: req.originalUrl,
            });
        });

        this.app.use(errorHandler);
    }

    private async dbInit(): Promise<void> {
        try {
            await AppDataSource.initialize();
            console.log(" Base de datos conectada exitosamente");
            console.log(` Entidades cargadas: ${AppDataSource.entityMetadatas.length}`);
        } catch (error) {
            console.error(" Error al conectar a la base de datos:", error);
            process.exit(1);
        }
    }

    public async listen(): Promise<void> {
        try {
            await this.dbInit();
            
            this.app.listen(this.port, () => {
                console.log(`Servidor corriendo en http://localhost:${this.port}`);
            });
        } catch (error) {
            console.error("Error al iniciar el servidor:", error);
            process.exit(1);
        }
    }
}

export default Server;