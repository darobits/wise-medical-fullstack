// src/middleware/rateLimit.middleware.js
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                  // 10 intentos por IP en esa ventana
  standardHeaders: true,    // info en headers RateLimit-*
  legacyHeaders: false,
  message: {
    message:
      "Demasiados intentos de login desde esta IP, intenta de nuevo más tarde."
  }
});
