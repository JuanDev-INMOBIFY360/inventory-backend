import {z} from "zod";

export const CreateCategoryDto = z.object ({
    name: z.string()
        .min(3, "El nombre de tener al menos 3 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),
    description: z.string()
        .max(500, "La descripción no puede superar los 500 caracteres")
        .optional(),
     isActive: z.boolean().default(true),
})

export type CreateCategoryDto = z.infer<typeof CreateCategoryDto>;

export const UpdateCategoryDto = CreateCategoryDto.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDto>;

export const CategoryIdParamsDto = z.object({
    id: z.uuid("ID de categoría inválido"),
});
export type CategoryIdParamsDto = z.infer<typeof CategoryIdParamsDto>;

