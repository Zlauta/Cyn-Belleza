import * as turnoService from "../services/turno.service.js";

export const consultarDisponibilidad = async (req, res, next) => {
  try {
    const { fecha, servicioId } = req.query;
    const horarios = await turnoService.obtenerHorariosDisponibles(
      fecha,
      servicioId,
    );
    res.json({ exito: true, datos: horarios });
  } catch (error) {
    next(error);
  }
};

export const crearTurnoPublico = async (req, res, next) => {
  try {
    const { servicioId, fechaHora, clienteManual } = req.body;

    // 1. Validaciones básicas (si usás Zod en la ruta, podés obviar esto)
    if (!servicioId || !fechaHora || !clienteManual) {
      return res.status(400).json({
        exito: false,
        mensaje:
          "Faltan datos requeridos (Servicio, Fecha/Hora o Datos del Cliente)",
      });
    }

    // 2. Le pasamos la pelota al Service
    const nuevoTurno = await turnoService.crearTurnoPublico({
      servicioId,
      fechaHora,
      clienteManual,
    });

    // 3. Respondemos al Frontend
    res.status(201).json({ exito: true, datos: nuevoTurno });
  } catch (error) {
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const nuevoTurno = await turnoService.crearTurno(req.usuario, req.body);

    res.status(201).json({
      exito: true,
      datos: nuevoTurno,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    let filtro = {};

    // Si NO es admin, le mostramos SOLO los turnos que él mismo pidió
    if (req.usuario.rol !== "ADMIN") {
      filtro = { usuarioId: req.usuario.id };
    }
    // Si es admin, el filtro queda vacío ({}) y le trae los de todo el mundo

    const turnos = await turnoService.obtenerTurnos(filtro);
    res.status(200).json(turnos);
  } catch (error) {
    next(error);
  }
};

export const cancelar = async (req, res, next) => {
  try {
    const turnoCancelado = await turnoService.cancelarTurno(
      req.params.id,
      req.usuario.id,
      req.usuario.rol,
    );
    res.status(200).json({
      mensaje: "Turno cancelado correctamente",
      turno: turnoCancelado,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarTurnoCompleto = async (req, res, next) => {
  try {
    const turnoActualizado = await turnoService.actualizarTurnoCompleto(
      req.params.id,
      req.body,
    );
    res.status(200).json({ exito: true, datos: turnoActualizado });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    // Esta ruta la va a usar tu mamá (Admin) o Mercado Pago
    const turnoActualizado = await turnoService.actualizarEstado(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      mensaje: "Estado del turno actualizado",
      turno: turnoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await turnoService.eliminarTurnoFisico(req.params.id);
    res
      .status(200)
      .json({ exito: true, mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
