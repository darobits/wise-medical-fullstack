// src/validations/auth.schemas.js
import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El email no tiene un formato válido",
    "any.required": "El email es obligatorio"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es obligatoria"
  })
});

export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es obligatorio"
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string()
    .valid("ADMIN", "GESTOR", "TURNERO", "PROFESIONAL")
    .default("TURNERO")
});
