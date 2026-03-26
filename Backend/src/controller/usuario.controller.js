import * as usuarioService from '../services/usuario.service.js';

export const registrar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.registrarUsuario(req.body);
    res.status(201).json({ exito: true, datos: usuario });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, contrasenia } = req.body;
    const datosLogin = await usuarioService.autenticarUsuario(email, contrasenia);
    res.status(200).json({ exito: true, datos: datosLogin });
  } catch (error) {
    next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios();
    res.status(200).json({ exito: true, datos: usuarios });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eliminado = await usuarioService.eliminarUsuario(id);
    res.status(200).json({ exito: true, mensaje: 'Usuario eliminado', datos: eliminado });
  } catch (error) {
    next(error);
  }
};