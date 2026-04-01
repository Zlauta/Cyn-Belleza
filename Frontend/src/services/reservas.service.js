import clienteAxios from '../api/axios';
import { atraparError } from '../utils/handlerError.js';

// Trae los servicios para mostrarlos en el catálogo
export const obtenerServiciosPublicos = async () => {
  try {
    const { data } = await clienteAxios.get('/servicios'); 
    return data.datos || data;
  } catch (error) { atraparError(error); }
};

// Envía el turno a la base de datos
export const crearReservaPublica = async (datosReserva) => {
  try {
    // Usamos una ruta específica para turnos públicos, o la misma si tu backend lo permite
    const { data } = await clienteAxios.post('/turnos/publico', datosReserva); 
    return data.datos || data;
  } catch (error) { atraparError(error); }
};