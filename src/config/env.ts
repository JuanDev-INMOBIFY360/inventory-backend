import dotenv from "dotenv";
import path from "path";

// Determinar el entorno
const nodeEnv = process.env.NODE_ENV || "development";

const envFileMap: Record<string, string> = {
    development: ".env.dev",
    production: ".env.prod",
    test: ".env.test",
};

const envFile = envFileMap[nodeEnv] || ".env.dev";

console.log("Cargando archivo:", envFile);
console.log("Ruta completa:", path.resolve(process.cwd(), envFile));

// Cargar archivo específico
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Cargar .env base como fallback
dotenv.config({ path: path.resolve(process.cwd(), ".env") });



export const config = {
    nodeEnv,
    port: parseInt(process.env.PORT || "3000"),
    logLevel: process.env.LOG_LEVEL || "info",
    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "123", 
        database: process.env.DB_NAME || "inventario_db",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "default-secret-key",
        expiresIn: "7d",
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    },
};

console.log("🔍 Config final:", {
    host: config.db.host,
    user: config.db.username,
    password: config.db.password ? "****" : "VACÍO",
    database: config.db.database,
});