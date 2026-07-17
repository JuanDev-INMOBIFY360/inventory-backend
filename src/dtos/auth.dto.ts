import { z } from "zod";
import {UserRole } from "../entities/User";
export const RegisterDto = z.object({
    name: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    username: z.string().min(3, "El usuario debe contener al menos 3 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.nativeEnum(UserRole).default(UserRole.SELLER),
})
export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
    username: z.string().min(1, "El nombre de usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
})
export type LoginDto = z.infer<typeof LoginDto>;

export interface AuthResponse {
    user: {
        id: string,
        name: string,
        email: string,
        username: string,
        role: UserRole
    };
    token: string
}