export const validarEsquema = (esquema) => (req, res, next) => {
  try {
    esquema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      exito: false,
      error: 'Error de validación de datos',
      detalles: error.errors.map(err => ({ campo: err.path.join('.'), mensaje: err.message }))
    });
  }
};