import rateLimit from 'express-rate-limit';

// Limitador específico para la creación de turnos
export const limiterTurnos = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: {
        exito: false,
        message: "Has realizado demasiadas solicitudes de turnos. Por favor, intentá de nuevo en 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
    
    // 👉 LA MAGIA: Forzamos al servidor a devolver un JSON perfecto
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json(options.message);
    }
});

// Limitador global 
export const limiterGlobal = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, 
    message: {
        exito: false,
        message: "Demasiadas peticiones desde esta IP. Relajá un poco."
    },
    // 👉 Se lo agregamos acá también
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json(options.message);
    }
});