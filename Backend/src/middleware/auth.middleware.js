import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new Error('Acceso denegado. No hay token provisto.');
      error.codigoEstado = 401;
      throw error;
    }

    const decodificado = jwt.verify(token, process.env.JWT_CLAVE_SECRETA);
    req.usuario = decodificado;
    next();
  } catch (error) {
    error.codigoEstado = 401;
    error.message = 'Token inválido o expirado';
    next(error);
  }
};

export const esAdministrador = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    const error = new Error('Acceso denegado. Se requieren permisos de administrador.');
    error.codigoEstado = 403;
    return next(error);
  }
  next();
};