import { z } from "zod";

export const CreateProductUnitDto = z.object({
    serial: z.string()
        .min(5, "El serial debe tener al menos 5 caracteres")
        .max(100, "El serial no puede superar los 100 caracteres"),
    status: z.string()
        .default("Nuevo Sellado"),
    purchasePrice: z.number()
        .positive("El precio de compra debe ser positivo")
        .optional(),
    salePrice: z.number()
        .positive("El precio de venta debe ser positivo")
        .optional(),
    entryDate: z.string()
        .or(z.date())
        .optional()
        .transform(val => val ? new Date(val) : undefined),
    productId: z.string()
        .uuid("ID de producto inválido"),
});

export type CreateProductUnitDto = z.infer<typeof CreateProductUnitDto>;

export const BulkCreateProductUnitDto = z.object({
    productId: z.string()
        .uuid("ID de producto inválido"),
    units: z.array(CreateProductUnitDto),
});

export type BulkCreateProductUnitDto = z.infer<typeof BulkCreateProductUnitDto>;

export const UpdateProductUnitDto = CreateProductUnitDto.partial();
export type UpdateProductUnitDto = z.infer<typeof UpdateProductUnitDto>;

export const SellProductUnitDto = z.object({
    clientId: z.string()
        .uuid("ID de cliente inválido"),
    salePrice: z.number()
        .positive("El precio de venta debe ser positivo"),
    saleDate: z.string()
        .or(z.date())
        .optional()
        .transform(val => val ? new Date(val) : new Date()),
});

export type SellProductUnitDto = z.infer<typeof SellProductUnitDto>;

export const ProductUnitIdParamsDto = z.object({
    id: z.string().uuid("ID de unidad inválido"),
});
export type ProductUnitIdParamsDto = z.infer<typeof ProductUnitIdParamsDto>;