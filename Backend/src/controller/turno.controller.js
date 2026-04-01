import * as turnoService from '../services/turno.service.js';

export const crear = async (req, res, next) => {
  try {
    // Sacamos el ID del usuario directamente del token por seguridad
    const usuarioId = req.usuario.id; 
    
    const nuevoTurno = await turnoService.crearTurno(usuarioId, req.body);
    res.status(201).json({ 
      mensaje: "Turno reservado con éxito", 
      turno: nuevoTurno 
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    let filtro = {};
    
    // Si NO es admin, le mostramos SOLO los turnos que él mismo pidió
    if (req.usuario.rol !== 'ADMIN') {
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
      req.usuario.rol
    );
    res.status(200).json({ 
      mensaje: "Turno cancelado correctamente", 
      turno: turnoCancelado 
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarTurnoCompleto = async (req, res, next) => {
  try {
    const turnoActualizado = await turnoService.actualizarTurnoCompleto(req.params.id, req.body);
    res.status(200).json({ exito: true, datos: turnoActualizado });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    // Esta ruta la va a usar tu mamá (Admin) o Mercado Pago
    const turnoActualizado = await turnoService.actualizarEstado(req.params.id, req.body);
    res.status(200).json({ 
      mensaje: "Estado del turno actualizado", 
      turno: turnoActualizado 
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await turnoService.eliminarTurnoFisico(req.params.id);
    res.status(200).json({exito: true, mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
