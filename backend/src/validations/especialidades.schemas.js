// src/validations/especialidades.schemas.js
import Joi from "joi";

export const especialidadCreateSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(255).allow(null, "").optional()
});

export const especialidadUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional(),
  descripcion: Joi.string().max(255).allow(null, "").optional()
}).min(1); // al menos un campo
