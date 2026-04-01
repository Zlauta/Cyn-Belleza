import clienteAxios from "../api/axios";
import { atraparError } from "../utils/handlerError.js"; // 👉 Importamos la global

export const loginService = async (credenciales) => {
  try {
    const { data } = await clienteAxios.post("/usuarios/login", credenciales);
    return data;
  } catch (error) {
    atraparError(error); // 👉 Usamos la global
  }
};

export const registroService = async (datosUsuario) => {
  try {
    const { data } = await clienteAxios.post(
      "/usuarios/registro",
      datosUsuario,
    );
    return data;
  } catch (error) {
    atraparError(error); // 👉 Usamos la global
  }
};

export const obtenerUsuarios = async () => {
  try {
    const { data } = await clienteAxios.get("/usuarios");
    return data.datos || data;
  } catch (error) {
    atraparError(error); // 👉 Usamos la global
  }
};

