import { Router } from 'express';
import * as turnoController from '../controller/turno.controller.js';
import { verificarToken, esAdministrador } from '../middleware/auth.middleware.js';
import { validarEsquema } from '../middleware/validador.middleware.js';
import { crearTurnoSchema, actualizarEstadoTurnoSchema } from '../schemas/turno.schema.js';

const rutasTurnos = Router();

// Todas las rutas de turnos requieren estar logueado, así que ponemos el middleware global para este router
rutasTurnos.use(verificarToken);

// Clientes y Admin
rutasTurnos.post('/', validarEsquema(crearTurnoSchema), turnoController.crear);
rutasTurnos.get('/', turnoController.obtenerTodos);
rutasTurnos.patch('/:id/cancelar', turnoController.cancelar); // Usamos PATCH porque solo cambiamos el estado

// Solo para la dueña del salón (o futuros webhooks de Mercado Pago)
rutasTurnos.patch('/:id/estado', esAdministrador, validarEsquema(actualizarEstadoTurnoSchema), turnoController.actualizarEstado);

export default rutasTurnos;