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
    // Si el usuario es admin (podríamos chequear req.usuario.rol), le mostramos todos.
    // Por ahora, traemos solo los activos para la vista pública.
    const servicios = await servicioService.obtenerServicios(true);
    res.status(200).json(servicios);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const servicio = await servicioService.obtenerServicioPorId(req.params.id);
    res.status(200).json(servicio);
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const servicioActualizado = await servicioService.actualizarServicio(
      req.params.id,
      req.body,
    );
    res
      .status(200)
      .json({ message: "Servicio actualizado", servicio: servicioActualizado });
  } catch (error) {
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
