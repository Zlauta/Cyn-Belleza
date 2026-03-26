import { Router } from 'express';

import { rutasUsuarios } from './usuarios.routes.js'; 


const routes = Router();

// Aquí montamos cada sub-ruta
routes.use('/usuarios', rutasUsuarios);

// Como este archivo agrupa TODO, aquí sí tiene sentido exportarlo por defecto
export default routes;