import Router from "express";
import * as servicioController from "../controller/servicio.controller.js";
import { validarEsquema } from "../middleware/validador.middleware.js";
import {
  verificarToken,
  esAdministrador,
} from "../middleware/auth.middleware.js";
import * as esquemas from "../schemas/servicio.schema.js";

export const rutasServicios = Router();

// Rutas públicas
rutasServicios.get("/", servicioController.obtenerTodos);
rutasServicios.get("/:id", servicioController.obtenerPorId);

// Rutas protegidas (solo admin)
rutasServicios.post(
  "/",
  verificarToken,
  esAdministrador,
  validarEsquema(esquemas.crearServicioSchema),
  servicioController.crear,
);
rutasServicios.put(
  "/:id",
  verificarToken,
  esAdministrador,
  validarEsquema(esquemas.actualizarServicioSchema),
  servicioController.actualizar,
);
rutasServicios.delete(
  "/:id",
  verificarToken,
  esAdministrador,
  servicioController.eliminar,
);

