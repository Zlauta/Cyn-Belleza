import { Router } from 'express';
import { registrar, login, obtenerTodos, eliminar } from '../controller/usuario.controller.js';
import { verificarToken, esAdministrador } from '../middleware/auth.middleware.js';
import { validarEsquema } from '../middleware/validador.middleware.js';
import { esquemaRegistroUsuario, esquemaLoginUsuario } from '../schemas/usuario.schema.js';

export const rutasUsuarios = Router();

// Rutas públicas
rutasUsuarios.post('/login', validarEsquema(esquemaLoginUsuario), login);

// Rutas protegidas (Solo Administrador)
// Usamos el middleware de validación con Zod para asegurar que los datos de creación vengan perfectos
rutasUsuarios.post('/registro', verificarToken, esAdministrador, validarEsquema(esquemaRegistroUsuario), registrar);
rutasUsuarios.get('/', verificarToken, esAdministrador, obtenerTodos);
rutasUsuarios.delete('/:id', verificarToken, esAdministrador, eliminar);