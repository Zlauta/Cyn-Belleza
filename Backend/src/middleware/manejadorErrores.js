export const manejadorErrores = (err, req, res, next) => {
  console.error("❌ Error capturado:", err.message);

  const codigoEstado = err.codigoEstado || 500;
  const mensaje = err.message || 'Error interno del servidor';

  res.status(codigoEstado).json({
    exito: false,
    error: mensaje,
    pila: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};