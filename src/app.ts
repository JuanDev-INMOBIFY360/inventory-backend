import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { AppDataSource } from "./config/database";
import { config } from "./config/env";

// rutas
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import productUnitRoutes from "./routes/product-unit.routes";
import clientRoutes from "./routes/client.routes";
import movementRoutes from "./routes/movement.routes";
import supplierRoutes from "./routes/supplier.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import healthRoutes from "./routes/health.routes"; 

// middlewares
import { errorHandler } from "./middlewares/errorHandler";
import { generalLimiter, authLimiter, adminLimiter } from "./middlewares/rateLimiter"; 

class Server {
    private app: Application;
    private port: number; 

    constructor() {
        this.app = express();
        this.port = config.port; 
        this.middlewares();
        this.routes();
    }

  
    private middlewares(): void {
        // Seguridad
        this.app.use(helmet());
        
        // Compresión 
        this.app.use(compression());
        
        // Rate Limiting 
        this.app.use(generalLimiter);
        
        // CORS
        this.app.use(cors({
            origin: config.cors.origin,
            credentials: true,
        }));
        
        // Parseo de JSON
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        // Health check
        this.app.use("/health", healthRoutes);

        // Rate Limiting específico para auth
        this.app.use("/api/auth/login", authLimiter);
        this.app.use("/api/auth/register", authLimiter);

        // Rate Limiting para rutas admin
        this.app.use("/api/categories", adminLimiter);
        this.app.use("/api/products", adminLimiter);
        this.app.use("/api/product-units", adminLimiter);

        // Rutas de la API
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/categories", categoryRoutes);
        this.app.use("/api/products", productRoutes);
        this.app.use("/api/product-units", productUnitRoutes);
        this.app.use("/api/clients", clientRoutes);
        this.app.use("/api/movements", movementRoutes);
        this.app.use("/api/suppliers", supplierRoutes);
        this.app.use("/api/dashboard", dashboardRoutes);

        // 404
        this.app.use((req, res) => {
            res.status(404).json({
                error: "Ruta no encontrada",
                path: req.originalUrl,
            });
        });

        // Manejador de errores global
        this.app.use(errorHandler);
    }

    //Iniciador base de datos
    private async dbInit(): Promise<void> {
        try {
            await AppDataSource.initialize();
            console.log(`Base de datos conectada (${config.db.host})`);
            console.log(`Entidades cargadas: ${AppDataSource.entityMetadatas.length}`);
        } catch (error) {
            console.error("Error al conectar a la base de datos:", error);
            process.exit(1);
        }
    }

    //Inicializador Server
    public async listen(): Promise<void> {
        try {
            await this.dbInit();
            
            this.app.listen(this.port, () => {
                console.log(`Servidor corriendo en http://localhost:${this.port}`);
                console.log(` Health check: http://localhost:${this.port}/health`);
                console.log(` Entorno: ${config.nodeEnv}`);
                console.log(` Rate Limiting: 100 peticiones cada 15 min`);
                console.log(` Compresión: activada (gzip)`);
            });
        } catch (error) {
            console.error("Error al iniciar el servidor:", error);
            process.exit(1);
        }
    }
}

export default Server;