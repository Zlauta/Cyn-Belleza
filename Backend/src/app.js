import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { manejadorErrores } from "./middleware/manejadorErrores.js";
import morgan from "morgan";
import { limiterGlobal } from "./middleware/rateLimit.Middleware.js";
import { qrActualTexto } from "./services/whatsapp.service.js";
import qrcode from "qrcode";

const app = express();
app.set("trust proxy", 1); // Si el backend va a estar detrás de un proxy (ej: Heroku, Nginx), esto es importante para que el rate limiter funcione correctamente con las IPs reales de los clientes
app.use(express.json());
// Middlewares globales
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true
}));

app.use(morgan("dev"));

app.use(limiterGlobal);

// Rutas
app.use("/api", routes);

app.get("/api/bot/qr", async (req, res) => {
  if (!qrActualTexto) {
    return res.send(
      "<h1>El bot ya está conectado o todavía no cargó el QR.</h1>",
    );
  }

  try {
    // Transformamos el texto en una imagen real
    const qrImagenBase64 = await qrcode.toDataURL(qrActualTexto);
    res.send(`
      <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; background-color:#f3f4f6;">
        <h2 style="font-family:sans-serif;">Escaneá este código para conectar CYN Belleza</h2>
        <img src="${qrImagenBase64}" alt="Código QR" style="width:300px; height:300px; border-radius:10px; box-shadow:0 4px 6px rgba(0,0,0,0.1);" />
      </div>
    `);
  } catch (err) {
    res.status(500).send("Error generando la imagen del QR");
  }
});

// Manejador de errores global siempre al final de todo
app.use(manejadorErrores);

// Exportamos la app configurada pero SIN encender el servidor
export default app;
