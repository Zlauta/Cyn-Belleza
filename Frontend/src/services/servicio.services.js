import clienteAxios from '../api/axios';

// Función auxiliar para cazar errores (reutilizamos tu lógica impecable)
const atraparError = (error) => {
  let mensajeError = 'Error de conexión con el servidor.';
  if (error.response?.data) {
    const data = error.response.data;
    mensajeError = data.error || data.mensaje || data.message || mensajeError;
    if (Array.isArray(data) && data.length > 0 && data[0].message) {
      mensajeError = data[0].message;
    } else if (Array.isArray(data.errors) && data.errors.length > 0) {
      mensajeError = data.errors[0].message;
    }
  }
  throw new Error(mensajeError);
};

// 🟢 LEER TODOS
export const obtenerServicios = async () => {
  try {
    const { data } = await clienteAxios.get('/servicios');
    // Asumimos que tu backend devuelve los datos en data.datos o directamente en data
    return data.datos || data; 
  } catch (error) {
    atraparError(error);
  }
};

// 🔵 CREAR
export const crearServicio = async (datosServicio) => {
  try {
    const { data } = await clienteAxios.post('/servicios', datosServicio);
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