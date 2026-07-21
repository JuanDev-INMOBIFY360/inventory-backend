import winston from "winston";

// Usar process.env directamente, NO importar config
const nodeEnv = process.env.NODE_ENV || "development";
const logLevel = process.env.LOG_LEVEL || "info";

// Definir niveles de log
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Colores para cada nivel
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
};

winston.addColors(colors);

// Formato para DESARROLLO (colores y legible)
const devFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
    })
);

// Formato para PRODUCCIÓN (JSON puro)
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Elegir formato según entorno
const format = nodeEnv === "production" ? prodFormat : devFormat;

// Crear el logger
const logger = winston.createLogger({
    level: logLevel,
    levels,
    format,
    transports: [
        //  Siempre mostrar en consola
        new winston.transports.Console(),
        
        // En producción, guardar en archivos
        ...(nodeEnv === "production"
            ? [
                new winston.transports.File({ filename: "logs/error.log", level: "error" }),
                new winston.transports.File({ filename: "logs/combined.log" }),
              ]
            : []
        ),
    ],
});

export default logger;