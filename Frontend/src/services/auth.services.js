import clienteAxios from '../api/axios';

export const loginService = async (credenciales) => {
  try {
    const { data } = await clienteAxios.post('/usuarios/login', credenciales);
    return data;
  } catch (error) {
    // 🕵️‍♂️ Cazador de errores mejorado
    let mensajeError = 'Error de conexión con el servidor. Intenta más tarde.';

    if (error.response && error.response.data) {
      const data = error.response.data;
      
      // 1. Buscamos en las propiedades clásicas
      mensajeError = data.error || data.mensaje || data.message || mensajeError;

      // 2. Si es un error de Zod (suele venir como un array)
      if (Array.isArray(data) && data.length > 0 && data[0].message) {
        mensajeError = data[0].message; // "Invalid input: expected string..."
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        mensajeError = data.errors[0].message;
      }
    }

    throw new Error(mensajeError);
  }
};

export const registroService = async (datosUsuario) => {
  try {
    const { data } = await clienteAxios.post('/usuarios/registro', datosUsuario);
    return data;
  } catch (error) {
    let mensajeError = 'Error al registrar usuario.';
    if (error.response && error.response.data) {
      const data = error.response.data;
      mensajeError = data.error || data.mensaje || data.message || mensajeError;
      
      if (Array.isArray(data) && data.length > 0 && data[0].message) {
        mensajeError = data[0].message;
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        mensajeError = data.errors[0].message;
      }
    }
    throw new Error(mensajeError);
  }
};