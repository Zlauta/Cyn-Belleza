import clienteAxios from "../api/axios.js";
import { atraparError } from "../utils/handlerError.js";

export const obtenerTurnos = async () => {
  try {
    const { data } = await clienteAxios.get("/turnos");
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

export const crearTurno = async (datosTurno) => {
  try {
    const { data } = await clienteAxios.post("/turnos", datosTurno);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

export const actualizarTurno = async (id, datosTurno) => {
  try {
    const { data } = await clienteAxios.put(`/turnos/${id}`, datosTurno);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

export const eliminarTurno = async (id) => {
  try {
    const { data } = await clienteAxios.delete(`/turnos/${id}`);
    return data;
  } catch (error) {
    atraparError(error);
  }
};
