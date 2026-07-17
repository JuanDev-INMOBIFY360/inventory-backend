import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductUnit } from "../entities/ProductUnit";
import { Client } from "../entities/Client";
import { Movement } from "../entities/Movement";
import { User } from "../entities/User";
import { Supplier } from "../entities/Supplier"; 

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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