import dotenv from 'dotenv';
import app from './app.js';

// Cargamos las variables de entorno (.env)
dotenv.config();

const PUERTO = process.env.PORT || 5000;

// Encendemos el servidor
app.listen(PUERTO, () => {
  console.log(`🌸 Servidor de CYN Belleza encendido y escuchando en http://localhost:${PUERTO}`);
});