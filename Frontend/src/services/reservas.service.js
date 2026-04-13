import clienteAxios from '../api/axios';
import { atraparError } from '../utils/handlerError.js';

export const consultarDisponibilidadPublica = async (fecha, servicioId) => {
  try {
    const { data } = await clienteAxios.get('/turnos/disponibilidad', {
      params: { fecha, servicioId }
    });
    return data.datos || []; // Devolvemos el array de horarios ["09:00", "10:30", ...]
  } catch (error) { 
    atraparError(error); 
    return []; // Si hay error, devolvemos array vacío para no romper el front
  }
};
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