import { Router } from 'express';
import { registrar, login, obtenerTodos, eliminar, obtenerPorId, actualizar } from '../controller/usuario.controller.js';
import { verificarToken, esAdministrador } from '../middleware/auth.middleware.js';
import { validarEsquema } from '../middleware/validador.middleware.js';
import { esquemaRegistroUsuario, esquemaLoginUsuario, esquemaActualizarUsuario } from '../schemas/usuario.schema.js';

export const rutasUsuarios = Router();

// Rutas públicas
rutasUsuarios.post('/login', validarEsquema(esquemaLoginUsuario), login);
rutasUsuarios.post('/registro', validarEsquema(esquemaRegistroUsuario), registrar);
// Rutas protegidas (Solo Administrador)
// Usamos el middleware de validación con Zod para asegurar que los datos de creación vengan perfectos

rutasUsuarios.get('/', verificarToken, esAdministrador, obtenerTodos);
rutasUsuarios.delete('/:id', verificarToken, esAdministrador, eliminar);

rutasUsuarios.get('/:id', verificarToken, esAdministrador, obtenerPorId);
rutasUsuarios.put('/:id', verificarToken, esAdministrador, validarEsquema(esquemaActualizarUsuario), actualizar);
// Si queremos que el admin pueda actualizar sin necesidad de enviar la contraseña, podríamos crear un nuevo esquema específico para actualización, donde la contraseña sea opcional. Pero por ahora, vamos a requerir todos los campos para simplificar.