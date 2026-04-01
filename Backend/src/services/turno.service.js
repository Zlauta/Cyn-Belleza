import { prisma } from '../db.js';

export const crearTurno = async (usuarioSolicitante, datos) => {
  const rolSeguro = usuarioSolicitante.rol ? usuarioSolicitante.rol.toUpperCase() : 'USER';
  const esAdmin = rolSeguro === 'ADMIN';

  // Determinamos de quién es el turno
  let finalClienteId = null;
  let nombreManual = null;

  if (esAdmin) {
    if (datos.clienteId) {
      finalClienteId = parseInt(datos.clienteId); // Eligió a alguien de la lista
    } else if (datos.clienteManual) {
      nombreManual = datos.clienteManual; // Escribió "Doña Rosa" a mano
    }
  } else {
    // Si lo pide un cliente desde la web, forzamos su propio ID
    finalClienteId = parseInt(usuarioSolicitante.id);
  }

  return await prisma.turno.create({
    data: {
      fechaHora: new Date(datos.fechaHora),
      clienteId: finalClienteId,
      clienteManual: nombreManual, // 👉 Guardamos el texto libre
      servicioId: parseInt(datos.servicioId),
      estado: datos.estado || "PENDIENTE"
    },
    include: {
      servicio: true,
      cliente: { select: { nombre: true, email: true } }
    }
  });
};

export const obtenerTurnos = async (filtro = {}) => {
  return await prisma.turno.findMany({
    where: filtro,
    include: {
      servicio: true,
      cliente: { select: { nombre: true, email: true } }
    },
    orderBy: { fechaHora: 'asc' } 
  });
};

export const obtenerTurnoPorId = async (id) => {
  const turno = await prisma.turno.findUnique({
    where: { id: parseInt(id) },
    include: { servicio: true }
  });
  if (!turno) throw { status: 404, message: "Turno no encontrado" };
  return turno;
};

// 🔥 EDICIÓN COMPLETA (Solo para Admin) 🔥
export const actualizarTurnoCompleto = async (id, datos) => {
  // 1. Verificamos que el turno exista
  await obtenerTurnoPorId(id);

  // 2. Armamos el paquete básico
  const dataActualizada = {
    fechaHora: datos.fechaHora ? new Date(datos.fechaHora) : undefined,
    servicioId: datos.servicioId ? parseInt(datos.servicioId) : undefined,
    estado: datos.estado
  };
  
  // 👉 3. LA MAGIA DEL INTERCAMBIO (SWAP)
  // Si mandó un ID, guardamos el ID y limpiamos el nombre manual
  if (datos.clienteId) {
    dataActualizada.clienteId = parseInt(datos.clienteId);
    dataActualizada.clienteManual = null; 
  } 
  // Si no hay ID pero hay texto, guardamos el texto y limpiamos el ID
  else if (datos.clienteManual) {
    dataActualizada.clienteManual = datos.clienteManual;
    dataActualizada.clienteId = null; 
  }

  // 4. Guardamos en Prisma y devolvemos el turno con sus relaciones
  return await prisma.turno.update({
    where: { id: parseInt(id) },
    data: dataActualizada,
    include: {
      servicio: true,
      cliente: { select: { nombre: true, email: true } }
    }
  });
};

// Esta es la función que usará tu mamá manualmente, o Mercado Pago automáticamente
export const actualizarEstado = async (id, datosActualizacion) => {
  await obtenerTurnoPorId(id);

  return await prisma.turno.update({
    where: { id: parseInt(id) },
    data: datosActualizacion
  });
};

// 🔥 LA REGLA DE ORO DE LAS 24 HORAS 🔥
export const cancelarTurno = async (id, clienteId, rolUsuario) => {
  const turno = await obtenerTurnoPorId(id);

  // 1. Verificamos que el turno le pertenezca a quien lo quiere cancelar (salvo que sea la dueña)
  if (rolUsuario !== 'ADMIN' && turno.clienteId !== clienteId) {
    throw { status: 403, message: "No tienes permiso para cancelar este turno" };
  }

  // 2. Verificamos que no esté cancelado ya
  if (turno.estado === 'CANCELADO') {
    throw { status: 400, message: "El turno ya se encuentra cancelado" };
  }

  // 3. Calculamos la diferencia de tiempo
  const ahora = new Date();
  const fechaDelTurno = new Date(turno.fechaHora);
  
  // Restamos las fechas (da en milisegundos) y lo pasamos a horas
  const diferenciaEnHoras = (fechaDelTurno - ahora) / (1000 * 60 * 60);

  // 4. Si es cliente y faltan menos de 24 hs, lo bloqueamos
  if (rolUsuario !== 'ADMIN' && diferenciaEnHoras < 24) {
    throw { 
      status: 400, 
      message: "No puedes cancelar un turno con menos de 24 horas de anticipación. Por favor comunícate directamente con el salón." 
    };
  }

  return await prisma.turno.update({
    where: { id: parseInt(id) },
    data: { estado: 'CANCELADO' }
  });
};

export const eliminarTurnoFisico = async (id) => {
  // 1. Verificamos que exista antes de intentar borrar
  await obtenerTurnoPorId(id);

  // 2. Lo borramos definitivamente de la base de datos
  return await prisma.turno.delete({
    where: { id: parseInt(id) }
  });
};