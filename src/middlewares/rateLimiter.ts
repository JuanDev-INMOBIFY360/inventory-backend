import rateLimit from "express-rate-limit";

//limitador general
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Demasiadas peticiones, intenta despues de 15 minutos"
    },
    standardHeaders: true,
    legacyHeaders: false
});

//limitador de login
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Demasiados intentos de inicio de sesión, intenta después de 15 minutos",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

//3. limitador Admin

export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        error: "Demasiados intentos de inicio de sesión, intenta después de 15 minutos",
    },
    standardHeaders: true,
    legacyHeaders: false,
})