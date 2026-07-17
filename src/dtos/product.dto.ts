
import { z } from "zod";

export const CreateProductDto = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(200, "El nombre no puede superar los 200 caracteres"),
    brand: z.string()
        .min(2, "La marca debe tener al menos 2 caracteres")
        .max(100, "La marca no puede superar los 100 caracteres"),
    edition: z.string()
        .max(200, "La edición no puede superar los 200 caracteres")
        .optional(),
    content: z.string()
        .max(500, "El contenido no puede superar los 500 caracteres")
        .optional(),
    type: z.string()
        .max(100, "El tipo no puede superar los 100 caracteres")
        .optional(),
    storage: z.string()
        .max(50, "El almacenamiento no puede superar los 50 caracteres")
        .optional(),
    basePrice: z.number()
        .positive("El precio base debe ser positivo")
        .min(0.01, "El precio base debe ser mayor a 0"),
    categoryId: z.string()
        .uuid("ID de categoría inválido"),
});

export type CreateProductDto = z.infer<typeof CreateProductDto>;

export const UpdateProductDto = CreateProductDto.partial();
export type UpdateProductDto = z.infer<typeof UpdateProductDto>;

export const ProductIdParamsDto = z.object({
    id: z.string().uuid("ID de producto inválido"),
});
export type ProductIdParamsDto = z.infer<typeof ProductIdParamsDto>;