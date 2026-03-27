import { Router } from "express";

import  { rutasUsuarios }  from "./usuarios.routes.js";
import  { rutasServicios }  from "./servicios.routes.js";
import { rutasTurnos } from "./turnos.routes.js";

const routes = Router();

// Aquí montamos cada sub-ruta
routes.use("/usuarios", rutasUsuarios);
routes.use("/servicios", rutasServicios);
routes.use("/turnos", rutasTurnos);


// Como este archivo agrupa TODO, aquí sí tiene sentido exportarlo por defecto
export default routes;
