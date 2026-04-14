import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { manejadorErrores } from "./middleware/manejadorErrores.js";
import morgan from "morgan";
import { limiterGlobal } from "./middleware/rateLimit.Middleware.js";

const app = express();
app.set('trust proxy', 1); // Si el backend va a estar detrás de un proxy (ej: Heroku, Nginx), esto es importante para que el rate limiter funcione correctamente con las IPs reales de los clientes
app.use(express.json());
// Middlewares globales
app.use(cors({
  // Acá ponés la URL que Vercel le dio a tu Frontend (sin la barra / al final)
  origin: [process.env.APP_URL], 
  credentials: true
}));

app.use(morgan("dev"));

app.use(limiterGlobal)

// Rutas
app.use("/api", routes);

// Manejador de errores global siempre al final de todo
app.use(manejadorErrores);

// Exportamos la app configurada pero SIN encender el servidor
export default app;
