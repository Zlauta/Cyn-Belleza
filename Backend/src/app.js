import express from 'express';
import cors from 'cors';
import  routes  from './routes/index.routes.js';
import { manejadorErrores } from './middleware/manejadorErrores.js';
import morgan from 'morgan';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use("/api", routes);

// Manejador de errores global siempre al final de todo
app.use(manejadorErrores);

// Exportamos la app configurada pero SIN encender el servidor
export default app;