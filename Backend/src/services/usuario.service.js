import { prisma } from "../db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (datos) => {
  const existeEmail = await prisma.usuarios.findUnique({
    where: { email: datos.email },
  });

  if (existeEmail) {
    const error = new Error("El email ya está registrado");
    error.codigoEstado = 400;
    throw error;
  }

  const contrasenaHasheada = await argon2.hash(datos.contrasenia);

  const nuevoUsuario = await prisma.usuarios.create({
    data: {
      nombre: datos.nombre,
      email: datos.email,
      contrasenia: contrasenaHasheada,
      rol: datos.rol || "CLIENTE",
      telefono: datos.telefono
    },
    // No devolvemos la contraseña al frontend
    select: { id: true, nombre: true, email: true, rol: true, telefono: true },
  });

  const token = jwt.sign(
    { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
    process.env.JWT_CLAVE_SECRETA,
    { expiresIn: "24h" },
  );

  return {
    token,
    usuario: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      telefono: nuevoUsuario.telefono // 👉 Agregamos el teléfono al retorno del registro
    },
  };
};

export const autenticarUsuario = async (email, contrasenia) => {
  const usuario = await prisma.usuarios.findUnique({ where: { email } });

  if (!usuario) {
    const error = new Error("Credenciales inválidas");
    error.codigoEstado = 401;
    throw error;
  }

  const contrasenaValida = await argon2.verify(
    usuario.contrasenia,
    contrasenia,
  );

  if (!contrasenaValida) {
    const error = new Error("Credenciales inválidas");
    error.codigoEstado = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_CLAVE_SECRETA,
    { expiresIn: "24h" },
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      telefono: usuario.telefono // 👉 Agregamos el teléfono al retorno del login
    },
  };
};

export const obtenerTodosLosUsuarios = async (pagina = 1, limite = 20) => {
  const skip = (pagina - 1) * limite;
  
  const [usuarios, total] = await Promise.all([
    prisma.usuarios.findMany({
      select: { id: true, nombre: true, email: true, rol: true, telefono: true },
      skip,
      take: limite,
      orderBy: { createdAt: "desc" },
    }),
    prisma.usuarios.count(),
  ]);

  return {
    datos: usuarios,
    paginacion: {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const eliminarUsuario = async (id) => {
  return await prisma.usuarios.delete({
    where: { id: Number(id) },
    select: { id: true, nombre: true },
  });
};

export const obtenerUsuarioPorId = async (id) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id: Number(id) },
    select: { id: true, nombre: true, email: true, rol: true, telefono: true },
  });
  if (!usuario) throw { status: 404, message: "Usuario no encontrado" };
  return usuario;
};

export const actualizarUsuario = async (id, datosActualizados) => {
  if (datosActualizados.contrasenia) {
    datosActualizados.contrasenia = await argon2.hash(datosActualizados.contrasenia);
  }

  return await prisma.usuarios.update({
    where: { id: Number(id) },
    data: datosActualizados,
    select: { id: true, nombre: true, email: true, rol: true, telefono: true },
  });
};
