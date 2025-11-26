import Joi from "joi";

export const createEspecialidadSchema = Joi.object({
  nombre: Joi.string().min(3).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres"
  }),
  descripcion: Joi.string().allow("", null)
});

export const updateEspecialidadSchema = Joi.object({
  nombre: Joi.string().min(3).messages({
    "string.min": "El nombre debe tener al menos 3 caracteres"
  }),
  descripcion: Joi.string().allow("", null)
});
