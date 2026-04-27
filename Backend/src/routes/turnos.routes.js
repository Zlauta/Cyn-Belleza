import { Router } from 'express';
import * as turnoController from '../controller/turno.controller.js';
import { verificarToken, esAdministrador } from '../middleware/auth.middleware.js';
import { validarEsquema } from '../middleware/validador.middleware.js';
import { crearTurnoSchema, actualizarEstadoTurnoSchema } from '../schemas/turno.schemas.js';
import { limiterTurnos } from '../middleware/rateLimit.middleware.js';

export const rutasTurnos = Router();
// Ventanilla pública para que el cliente consulte qué horas hay libres
rutasTurnos.get('/disponibilidad', turnoController.consultarDisponibilidad);
rutasTurnos.post('/publico',limiterTurnos, turnoController.crearTurnoPublico);

// Todas las rutas de turnos requieren estar logueado, así que ponemos el middleware global para este router
rutasTurnos.use(verificarToken);

// Clientes y Admin

rutasTurnos.post('/', validarEsquema(crearTurnoSchema),limiterTurnos, turnoController.crear);
rutasTurnos.get('/', turnoController.obtenerTodos);
rutasTurnos.get('/mis-turnos', turnoController.obtenerMisTurnos);
rutasTurnos.patch('/:id', turnoController.cancelar); // Usamos PATCH porque solo cambiamos el estado


// Solo para la dueña del salón (o futuros webhooks de Mercado Pago)
rutasTurnos.patch('/:id/estado', esAdministrador, validarEsquema(actualizarEstadoTurnoSchema), turnoController.actualizarEstado);

rutasTurnos.put('/:id', esAdministrador, turnoController.actualizarTurnoCompleto);

// Solo la dueña puede borrar registros de la base de datos
rutasTurnos.delete('/:id', esAdministrador, turnoController.eliminar);

