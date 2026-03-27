import { z } from "zod";

export const crearTurnoSchema = z.object({
  fechaHora: z
    .string({
      required_error: "La fecha y hora son obligatorias",
    })
    .refine((fecha) => new Date(fecha) > new Date(), {
      message: "No puedes reservar un turno en el pasado",
    }),

  servicioId: z
    .number({
      required_error: "El ID del servicio es obligatorio",
      invalid_type_error: "El ID del servicio debe ser un número",
    })
    .int()
    .positive(),
});

export const actualizarEstadoTurnoSchema = z.object({
  estado: z
    .enum(["PENDIENTE", "CONFIRMADO", "CANCELADO", "COMPLETADO"], {
      errorMap: () => ({ message: "El estado del turno no es válido" }),
    })
    .optional(),

  estadoPago: z
    .enum(["PENDIENTE", "PAGADO", "REEMBOLSADO"], {
      errorMap: () => ({ message: "El estado de pago no es válido" }),
    })
    .optional(),

  transaccionId: z.string().optional(),
});
