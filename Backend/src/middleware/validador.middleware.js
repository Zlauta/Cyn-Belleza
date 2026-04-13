export const validarEsquema = (esquema) => async (req, res, next) => {
  try {
    await esquema.parseAsync(req.body);
    next(); 
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        mensaje: "Error de validación en los datos enviados",
        errores: error.errors.map((err) => err.message),
      });
    }
    
    next(error);
  }
};