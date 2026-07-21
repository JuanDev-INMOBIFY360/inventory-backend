// 📁 src/config/database.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./env";
import logger from "../utils/logger"; 
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductUnit } from "../entities/ProductUnit";
import { Client } from "../entities/Client";
import { Movement } from "../entities/Movement";
import { User } from "../entities/User";
import { Supplier } from "../entities/Supplier";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    logging: config.nodeEnv === "development",
    entities: [Category, Product, ProductUnit, Client, Movement, User, Supplier],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        logger.info(` Base de datos conectada (${config.db.host})`);
        logger.info(` Entidades cargadas: ${AppDataSource.entityMetadatas.length}`);
    } catch (error) {
        logger.error(" Error al conectar a la base de datos:", { error });
        process.exit(1);
    }
};