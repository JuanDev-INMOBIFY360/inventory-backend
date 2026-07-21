import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { JsonObject } from "swagger-ui-express";

const swaggerDir = path.resolve(__dirname, "../swagger");

//  Cargar el archivo principal (index.yaml)
const mainSpec = yaml.load(
    fs.readFileSync(path.join(swaggerDir, "index.yaml"), "utf8")
) as any;

//. Lista de archivos con paths a fusionar
const pathFiles = [
    "auth.yaml",
    "categories.yaml",
    "clients.yaml",
    "dashboard.yaml",
    "movements.yaml",
    "product-units.yaml",
    "products.yaml",
    "suppliers.yaml",
];

//  Fusionar los paths de cada archivo dentro del spec principal
mainSpec.paths = {};

for (const file of pathFiles) {
    const filePath = path.join(swaggerDir, file);
    if (!fs.existsSync(filePath)) {
        console.warn(` Archivo no encontrado: ${file}`);
        continue;
    }

    const parsed = yaml.load(fs.readFileSync(filePath, "utf8")) as any;

    if (parsed?.paths) {
        mainSpec.paths = { ...mainSpec.paths, ...parsed.paths };
    }
}

export const swaggerSpec = mainSpec as JsonObject;

// Opciones de Swagger UI
export const swaggerUiOptions = {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API de Inventario Digital",
    swaggerOptions: {
        docExpansion: "none",
        filter: true,
        showRequestDuration: true,
    },
};