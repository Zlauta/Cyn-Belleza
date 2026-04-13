import dotenv from 'dotenv';
import app from './app.js';

// Cargamos las variables de entorno (.env)
dotenv.config();

// Encendemos el servidor
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}