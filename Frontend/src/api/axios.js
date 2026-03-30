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

export default clienteAxios;