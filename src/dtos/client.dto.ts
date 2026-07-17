import { z } from "zod";


export const CreateClientDto = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(150, "El nombre no puede superar los 150 caracteres"),
    phone: z.string()
        .max(50, "El teléfono no puede superar los 50 caracteres")
        .optional(),
    email: z.string()
        .email("Email inválido")
        .max(150, "El email no puede superar los 150 caracteres")
        .optional(),
    address: z.string()
        .max(255, "La dirección no puede superar los 255 caracteres")
        .optional(),
});

export type CreateClientDto = z.infer<typeof CreateClientDto>;

export const UpdateClientDto = CreateClientDto.partial();
export type UpdateClientDto = z.infer<typeof UpdateClientDto>;

export const ClientIdParamsDto = z.object({
    id: z.string().uuid("ID de cliente inválido"),
});
export type ClientIdParamsDto = z.infer<typeof ClientIdParamsDto>;