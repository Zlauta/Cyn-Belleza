import clienteAxios from '../api/axios';
import { atraparError } from '../utils/handlerError.js';

export const obtenerTurnos = async () => {
  try {
    const { data } = await clienteAxios.get('/turnos');
    return data.datos || data; 
  } catch (error) {
    atraparError(error);
  }
};

export const crearTurno = async (datosTurno) => {
  try {
    const { data } = await clienteAxios.post('/turnos', datosTurno);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};
export const actualizarTurno = async (id, payloadCompleto) => {
  try {
    // Le pega a la nueva ruta PUT Dios
    const { data } = await clienteAxios.put(`/turnos/${id}`, payloadCompleto);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

export const actualizarEstadoTurno = async (id, nuevoEstado) => {
  try {
    const { data } = await clienteAxios.patch(`/turnos/${id}/estado`, { estado: nuevoEstado });
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

export const cancelarTurnoService = async (id) => {
  try {
    const { data } = await clienteAxios.patch(`/turnos/${id}/cancelar`);
    return data;
  } catch (error) {
    atraparError(error);
  }
};

export const eliminarTurnoService = async (id) => {
  try {
    const { data } = await clienteAxios.delete(`/turnos/${id}`);
    return data;
  } catch (error) {
    atraparError(error);
  }
};