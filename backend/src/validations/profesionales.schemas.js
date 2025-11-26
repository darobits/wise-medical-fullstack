// src/validations/profesionales.schemas.js
import Joi from "joi";

export const profesionalCreateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required(),
  matricula: Joi.string().min(3).max(50).required(),
  especialidadId: Joi.string().required(),
  activo: Joi.boolean().default(true)
});

export const profesionalUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).optional(),
  matricula: Joi.string().min(3).max(50).optional(),
  especialidadId: Joi.string().optional(),
  activo: Joi.boolean().optional()
}).min(1);
