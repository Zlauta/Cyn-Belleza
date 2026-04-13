import { prisma } from "../db.js";

export const crearServicio = async (datos) => {
  return await prisma.servicios.create({
    data: datos,
  });
};

export const obtenerServicios = async (soloActivos = true) => {
  // Si soloActivos es true, trae solo los que están en uso.
  // Si es false (para la vista de administrador), trae absolutamente todos.
  const filtro = soloActivos ? { activo: true } : {};

  return await prisma.servicios.findMany({
    where: filtro,
    orderBy: { categoria: "asc" }, // Los ordenamos alfabéticamente por categoría (Peluquería, Uñas, etc)
  });
};

export const obtenerServicioPorId = async (id) => {
  const servicio = await prisma.servicios.findUnique({
    where: { id: parseInt(id) },
  });
  if (!servicio) throw { status: 404, message: "Servicio no encontrado" };
  return servicio;
};

export const actualizarServicio = async (id, datos) => {
  await obtenerServicioPorId(id); // Verificamos que exista primero

  return await prisma.servicios.update({
    where: { id: parseInt(id) },
    data: datos,
  });
};

export const eliminarServicio = async (id) => {
  await obtenerServicioPorId(id);

  // Borrado lógico: no lo destruimos, solo lo desactivamos
  return await prisma.servicios.update({
    where: { id: parseInt(id) },
    data: { activo: false },
  });
};
