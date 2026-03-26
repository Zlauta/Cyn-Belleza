import { prisma } from '../db.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';


export const registrarUsuario = async (datos) => {
  const existeEmail = await prisma.usuarios.findUnique({
    where: { email: datos.email }
  });

  if (existeEmail) {
    const error = new Error('El email ya está registrado');
    error.codigoEstado = 400;
    throw error;
  }

  const contrasenaHasheada = await argon2.hash(datos.contrasenia);

  const nuevoUsuario = await prisma.usuarios.create({
    data: {
      nombre: datos.nombre,
      email: datos.email,
      contrasenia: contrasenaHasheada,
      rol: datos.rol || 'CLIENTE'
    },
    // No devolvemos la contraseña al frontend
    select: { id: true, nombre: true, email: true, rol: true } 
  });

  return nuevoUsuario;
};

export const autenticarUsuario = async (email, contrasenia) => {
  const usuario = await prisma.usuarios.findUnique({ where: { email } });

  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.codigoEstado = 401;
    throw error;
  }

  const contrasenaValida = await argon2.verify(usuario.contrasenia, contrasenia);
  
  if (!contrasenaValida) {
    const error = new Error('Credenciales inválidas');
    error.codigoEstado = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_CLAVE_SECRETA,
    { expiresIn: '24h' }
  );

  return { 
    token, 
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } 
  };
};

export const obtenerTodosLosUsuarios = async () => {
  return await prisma.usuarios.findMany({
    select: { id: true, nombre: true, email: true, rol: true }
  });
};

export const eliminarUsuario = async (id) => {
  return await prisma.usuarios.delete({
    where: { id: Number(id) },
    select: { id: true, nombre: true }
  });
};