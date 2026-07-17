import { z } from "zod";

export const CreateSupplierDto = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    contactName: z.string().optional(),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateSupplierDto = z.infer<typeof CreateSupplierDto>;

export const UpdateSupplierDto = CreateSupplierDto.partial();
export type UpdateSupplierDto = z.infer<typeof UpdateSupplierDto>;

export const SupplierIdParamsDto = z.object({
    id: z.string().uuid("ID de proveedor inválido"),
});
export type SupplierIdParamsDto = z.infer<typeof SupplierIdParamsDto>;