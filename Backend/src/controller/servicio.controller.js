import * as servicioService from "../services/servicio.service.js";

export const crear = async (req, res, next) => {
  try {
    const nuevoServicio = await servicioService.crearServicio(req.body);
    res
      .status(201)
      .json({ message: "Servicio creado con éxito", servicio: nuevoServicio });
  } catch (error) {
    next(error);
  }
};

export const obtenerTodos = async (req, res, next) => {
  try {
    // 👉 ACÁ ESTÁ EL CAMBIO: Le pasamos 'false' explícitamente
    // Esto le dice al servicio: "No quiero solo los activos, traeme TODOS"
    const servicios = await servicioService.obtenerServicios(false);

    res.status(200).json({ exito: true, datos: servicios });
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const servicio = await servicioService.obtenerServicioPorId(req.params.id);
    res.status(200).json({ exito: true, datos: servicio });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    // 🕵️‍♂️ LOS DETECTIVES: Imprimimos en la consola de Render lo que llega
    console.log(`\n📩 === INTENTANDO EDITAR SERVICIO ID: ${req.params.id} ===`);
    console.log("📦 BODY RECIBIDO EN EXPRESS:", req.body);
    console.log("===================================================\n");

    const servicioActualizado = await servicioService.actualizarServicio(
      req.params.id,
      req.body,
    );
    console.log("✨ RESULTADO REAL DE LA DB:", servicioActualizado);
    res
      .status(200)
      .json({ message: "Servicio actualizado", servicio: servicioActualizado });
  } catch (error) {
    console.error("❌ ERROR EN EL CONTROLADOR AL ACTUALIZAR:", error);
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await servicioService.eliminarServicio(req.params.id);
    res.status(200).json({ message: "Servicio desactivado correctamente" });
  } catch (error) {
    next(error);
  }
};
