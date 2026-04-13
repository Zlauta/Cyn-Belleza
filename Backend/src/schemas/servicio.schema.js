import { z } from 'zod';

export const crearServicioSchema = z.object({
  nombre: z.string({
    required_error: "El nombre del servicio es obligatorio",
  }).min(3, "El nombre debe tener al menos 3 caracteres"),
  
  descripcion: z.string().optional(),
  
  precio: z.number({
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número",
  }).positive("El precio debe ser mayor a 0"),
  
  duracion: z.number({
    required_error: "La duración es obligatoria",
    invalid_type_error: "La duración debe ser un número (en minutos)",
  }).int().positive("La duración debe ser mayor a 0 minutos"),
  
  categoria: z.string({
    required_error: "La categoría es obligatoria",
  }).min(2, "La categoría no es válida")
});

export const actualizarServicioSchema = crearServicioSchema.partial()