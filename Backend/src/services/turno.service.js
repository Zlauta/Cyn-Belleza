import { prisma } from '../db.js';

export const crearTurno = async (clienteID, datos) => {
  return await prisma.turno.create({
    data: {
      fechaHora: new Date(datos.fechaHora),
      clienteId: parseInt(clienteID),
      servicioId: parseInt(datos.servicioId)
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