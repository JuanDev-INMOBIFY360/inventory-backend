import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./env";
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
    logging: true,
    entities: [
        Category,
        Product,
        ProductUnit,
        Client,
        Movement,
        User,
        Supplier,
    ],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: [],
});