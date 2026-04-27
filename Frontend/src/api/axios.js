import axios from 'axios';

// Creamos la instancia base. Así no tenés que escribir localhost:3000/api en cada petición
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE PETICIONES (Para inyectar el token automáticamente en el futuro)
clienteAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR DE RESPUESTA (Manejo de errores de autenticación)
clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default clienteAxios;