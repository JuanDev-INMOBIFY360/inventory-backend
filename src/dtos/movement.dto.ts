import { z } from "zod";

export const CreateMovementDto = z.object({
    type: z.enum(["ENTRY", "SALE", "RETURN", "ADJUST"]),
    unitId: z.string().uuid("ID de unidad inválido"),
    reason: z.string().optional(),
});

export type CreateMovementDto = z.infer<typeof CreateMovementDto>;

export const MovementIdParamsDto = z.object({
    id: z.string().uuid("ID de movimiento inválido"),
});
export type MovementIdParamsDto = z.infer<typeof MovementIdParamsDto>;