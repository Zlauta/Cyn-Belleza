import Router from "express";
import * as servicioController from "../controller/usuario.controller.js";
import { validarEsquema } from "../middleware/validador.middleware.js";
import {
  verificarToken,
  esAdministrador,
} from "../middleware/auth.middleware.js";
import * as esquemas from "../schemas/servicio.schema.js";

const router = Router();

// Rutas públicas
router.get("/", servicioController.obtenerTodos);
router.get("/:id", servicioController.obtenerPorId);
// Rutas protegidas (solo admin)
router.post(
  "/",
  verificarToken,
  esAdministrador,
  validarEsquema(esquemas.crearServicioSchema),
  servicioController.crear,
);
router.put(
  "/:id",
  verificarToken,
  esAdministrador,
  validarEsquema(esquemas.actualizarServicioSchema),
  servicioController.actualizar,
);
router.delete(
  "/:id",
  verificarToken,
  esAdministrador,
  servicioController.eliminar,
);

export default router;
