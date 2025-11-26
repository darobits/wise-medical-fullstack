import Joi from "joi";

export const createUserSchema = Joi.object({
  nombre: Joi.string().min(2).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres"
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El email es obligatorio",
    "string.email": "El email no tiene un formato válido"
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos 4 caracteres"
  }),
  rol: Joi.string()
    .valid("ADMIN", "GESTOR", "TURNERO")
    .default("TURNERO")
    .messages({
      "any.only": "El rol debe ser ADMIN, GESTOR o TURNERO"
    })
});
