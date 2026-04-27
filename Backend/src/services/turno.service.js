import {
  addMinutes,
  isBefore,
  format,
  startOfDay,
  endOfDay,
  parseISO,
  isAfter,
  isSameDay,
} from "date-fns";
import { prisma } from "../db.js";
import { enviarAlertaCancelacionAdmin, enviarNotificacionTurno } from "./whatsapp.service.js";

export const obtenerHorariosDisponibles = async (fecha, servicioId) => {
  // 1. Obtenemos el servicio para saber cuánto dura
  const servicio = await prisma.servicios.findUnique({
    where: { id: parseInt(servicioId) },
  });
  if (!servicio) throw { status: 404, message: "Servicio no encontrado" };

  const duracionSrv = parseInt(servicio.duracion); // Minutos reales

  // 2. Definimos el horario según el día (0=Dom, 1=Lun... 6=Sab)
  const fechaObj = new Date(fecha + "T00:00:00");
  const diaSemana = fechaObj.getDay();

  if (diaSemana === 0) return []; // Domingos cerrado

  let horaInicio, horaFin;
  if (diaSemana >= 1 && diaSemana <= 5) {
    horaInicio = "16:00";
    horaFin = "21:00";
  } else {
    horaInicio = "08:30";
    horaFin = "21:00";
  }

  // 3. Traemos turnos ya ocupados (que no estén cancelados)
  const turnosOcupados = await prisma.turno.findMany({
    where: {
      fechaHora: {
        gte: startOfDay(fechaObj),
        lte: endOfDay(fechaObj),
      },
      estado: { not: "CANCELADO" },
    },
    include: { servicio: true },
    orderBy: { fechaHora: "asc" },
  });

  const ahora = new Date();
  const fechaConsultada = parseISO(fecha);
  const esHoy = isSameDay(fechaConsultada, ahora);

  const disponibles = [];
  let tiempoActual = parseISO(`${fecha}T${horaInicio}:00`);
  const tiempoLimite = parseISO(`${fecha}T${horaFin}:00`);

  while (
    isBefore(addMinutes(tiempoActual, duracionSrv), tiempoLimite) ||
    format(addMinutes(tiempoActual, duracionSrv), "HH:mm") === horaFin
  ) {
    const finPropuesto = addMinutes(tiempoActual, duracionSrv);

    // 1. Verificamos solapamiento con otros turnos
    const seSolapa = turnosOcupados.some((t) => {
      const tInicio = new Date(t.fechaHora);
      const tFin = addMinutes(tInicio, parseInt(t.servicio.duracion));
      return tiempoActual < tFin && finPropuesto > tInicio;
    });

    // 2. 🔥 NUEVA REGLA: Si es hoy, la hora debe ser posterior a "ahora"
    const esHoraValida = !esHoy || isAfter(tiempoActual, ahora);

    if (!seSolapa && esHoraValida) {
      disponibles.push(format(tiempoActual, "HH:mm"));
    }

    tiempoActual = addMinutes(tiempoActual, 30);
  }

  return disponibles;
};

export const crearTurno = async (usuarioSolicitante, datos) => {
  const rolSeguro = usuarioSolicitante.rol
    ? usuarioSolicitante.rol.toUpperCase()
    : "CLIENTE";
  const esAdmin = rolSeguro === "ADMIN";

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

  const nuevoTurno = await prisma.turno.create({
    data: {
      fechaHora: new Date(datos.fechaHora),
      clienteId: finalClienteId,
      clienteManual: nombreManual, // 👉 Guardamos el texto libre
      servicioId: parseInt(datos.servicioId),
      estado: datos.estado || "PENDIENTE",
    },
    include: {
      servicio: true,
      cliente: { select: { nombre: true, email: true, telefono: true } },
    },
  });

  // Enviar notificación de WhatsApp
  enviarNotificacionTurno(nuevoTurno).catch((err) =>
    console.log("Fallo silenciado del bot:", err.message),
  );

  return nuevoTurno;
};

export const obtenerTurnos = async (filtro = {}, pagina = 1, limite = 20) => {
  const skip = (pagina - 1) * limite;
  
  const [turnos, total] = await Promise.all([
    prisma.turno.findMany({
      where: filtro,
      include: {
        servicio: true,
        cliente: { select: { nombre: true, email: true } },
      },
      orderBy: { fechaHora: "asc" },
      skip,
      take: limite,
    }),
    prisma.turno.count({ where: filtro }),
  ]);

  return {
    datos: turnos,
    paginacion: {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerTurnoPorId = async (id) => {
  const turno = await prisma.turno.findUnique({
    where: { id: parseInt(id) },
    include: { servicio: true },
  });
  if (!turno) throw { status: 404, message: "Turno no encontrado" };
  return turno;
};

// 🔥 EDICIÓN COMPLETA (Solo para Admin) 🔥
export const actualizarTurnoCompleto = async (id, datos) => {
  // 1. Verificamos que el turno exista
  await obtenerTurnoPorId(id);

  // 2. Armamos el paquete básico de actualización
  const dataActualizada = {
    fechaHora: datos.fechaHora ? new Date(datos.fechaHora) : undefined,
    servicioId: datos.servicioId ? parseInt(datos.servicioId) : undefined,
    estado: datos.estado,
  };

  // 👉 3. ESCUDO ANTI-BORRADO DE IDs
  // Solo cambiamos al cliente si viene una orden estricta del frontend
  if (datos.clienteId) {
    // Si viene un ID válido, vinculamos y limpiamos el texto manual
    dataActualizada.clienteId = parseInt(datos.clienteId);
    dataActualizada.clienteManual = null;
  } else if (datos.clienteId === null && datos.clienteManual) {
    // 🔥 MAGIA ACÁ: Solo lo convertimos a "Manual" (y borramos el ID)
    // SI el frontend mandó explícitamente que el clienteId es null.
    // Si el frontend simplemente se olvidó de mandarlo (undefined), Prisma NO lo borra.
    dataActualizada.clienteManual = datos.clienteManual;
    dataActualizada.clienteId = null;
  }

  // 4. Guardamos en Prisma y devolvemos
  return await prisma.turno.update({
    where: { id: parseInt(id) },
    data: dataActualizada,
    include: {
      servicio: true,
      cliente: { select: { nombre: true, email: true } },
    },
  });
};

// Esta es la función que usará tu mamá manualmente, o Mercado Pago automáticamente
export const actualizarEstado = async (id, datosActualizacion) => {
  await obtenerTurnoPorId(id);

  return await prisma.turno.update({
    where: { id: parseInt(id) },
    data: datosActualizacion,
  });
};

// 🔥 LA REGLA DE ORO DE LAS 24 HORAS 🔥
// 👉 Asegurate de importar la función nueva arriba de todo:
// import { enviarAlertaCancelacionAdmin } from "./whatsapp.service.js";

// 🔥 LA REGLA DE ORO DE LAS 24 HORAS 🔥
export const cancelarTurno = async (id, clienteId, rolUsuario) => {
  const turno = await obtenerTurnoPorId(id);

  if (rolUsuario !== "ADMIN" && turno.clienteId !== clienteId) {
    throw { status: 403, message: "No tienes permiso para cancelar este turno" };
  }

  if (turno.estado === "CANCELADO") {
    throw { status: 400, message: "El turno ya se encuentra cancelado" };
  }

  const ahora = new Date();
  const fechaDelTurno = new Date(turno.fechaHora);
  const diferenciaEnHoras = (fechaDelTurno - ahora) / (1000 * 60 * 60);

  if (rolUsuario !== "ADMIN" && diferenciaEnHoras < 24) {
    throw {
      status: 400,
      message: "No puedes cancelar un turno con menos de 24 horas de anticipación.",
    };
  }

  // 1. Actualizamos el turno en la Base de Datos y pedimos que nos devuelva 
  // los datos del cliente y servicio para armar el mensaje
  const turnoActualizado = await prisma.turno.update({
    where: { id: parseInt(id) },
    data: { estado: "CANCELADO" },
    include: {
      servicio: true,
      cliente: true // Necesitamos esto para saber cómo se llama
    }
  });

  // 👉 2. MANDAMOS EL WHATSAPP A TU MAMÁ
  // Le ponemos el .catch para que si el celu de tu mamá no tiene internet o 
  // el bot se desconectó, el turno se cancele igual en la página web y no tire error.
  enviarAlertaCancelacionAdmin(turnoActualizado).catch((err) =>
    console.log("Fallo silenciado del bot al cancelar:", err.message),
  );

  return turnoActualizado;
};

export const eliminarTurnoFisico = async (id) => {
  // 1. Verificamos que exista antes de intentar borrar
  await obtenerTurnoPorId(id);

  // 2. Lo borramos definitivamente de la base de datos
  return await prisma.turno.delete({
    where: { id: parseInt(id) },
  });
};

// Agregá esto en tu turnos.service.js

export const crearTurnoPublico = async (datosReserva) => {
  // 🔥 ESCUDO DE SEGURIDAD: Por más que manden otro estado, forzamos PENDIENTE
  const nuevoTurno = await prisma.turno.create({
    data: {
      servicioId: Number(datosReserva.servicioId),
      fechaHora: new Date(datosReserva.fechaHora),
      clienteManual: datosReserva.clienteManual,
      estado: "PENDIENTE",
    },
    include: {
      servicio: true, // Opcional: devuelve info del servicio al front si la necesitás
    },
  });

  // Enviar notificación de WhatsApp
  enviarNotificacionTurno(nuevoTurno).catch((err) =>
    console.log("Fallo silenciado del bot:", err.message),
  );

  return nuevoTurno;
};

// Trae los turnos específicos de un cliente logueado
export const obtenerMisTurnos = async (clienteId) => {
  return await prisma.turno.findMany({
    where: {
      clienteId: parseInt(clienteId),
      estado: { not: "CANCELADO" },
       fechaHora: { gte: new Date() }, // Solo futuros
    },
    include: {
      servicio: true,
    },
    orderBy: { fechaHora: "asc" },
  });
};
