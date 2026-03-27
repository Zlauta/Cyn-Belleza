import { z } from 'zod';

export const esquemaRegistroUsuario = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().trim().min(1, "El email es obligatorio").email("Correo electrónico inválido"),
    contrasenia: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    rol: z.enum(['ADMIN', 'CLIENTE']).optional()
});

export const esquemaLoginUsuario = z.object({
    email: z.string().trim().min(1, "El email es obligatorio").email("Correo electrónico inválido"),
    contrasenia: z.string().min(1, "La contraseña es obligatoria")
  })