import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { config } from "../config/env";

export const healthCheck = async (_req: Request, res: Response) => {
    // 1. Verificar estado de la base de datos
    const dbStatus = AppDataSource.isInitialized ? "connected" : "disconnected";
    
    // 2. Construir objeto de respuesta
    const health = {
        status: dbStatus === "connected" ? "OK" : "DEGRADED",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()), // Segundos desde que inició
        environment: config.nodeEnv,
        version: process.env.npm_package_version || "1.0.0",
        services: {
            database: {
                status: dbStatus,
                host: config.db.host,
            },
            server: {
                port: config.port,
                memory: {
                    rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + "MB",
                    heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
                },
            },
        },
    };

    // 3. Devolver respuesta
    res.status(health.status === "OK" ? 200 : 503).json(health);
};