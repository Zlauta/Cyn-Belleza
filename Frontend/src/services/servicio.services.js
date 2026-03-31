import clienteAxios from "../api/axios.js";
import { atraparError } from "../utils/handlerError.js"; // 👉 Importamos la global

// 🟢 LEER TODOS
export const obtenerServicios = async () => {
  try {
    const { data } = await clienteAxios.get("/servicios");
    return data.datos || data;
  } catch (error) {
    atraparError(error); // 👉 Usamos la global
  }
};

// 🔵 CREAR
export const crearServicio = async (datosServicio) => {
  try {
    const { data } = await clienteAxios.post("/servicios", datosServicio);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

// 🟠 ACTUALIZAR
export const actualizarServicio = async (id, datosServicio) => {
  try {
    const { data } = await clienteAxios.put(`/servicios/${id}`, datosServicio);
    return data.datos || data;
  } catch (error) {
    atraparError(error);
  }
};

// 🔴 BORRAR
export const eliminarServicio = async (id) => {
  try {
    const { data } = await clienteAxios.delete(`/servicios/${id}`);
    return data;
  } catch (error) {
    atraparError(error);
  }
};
