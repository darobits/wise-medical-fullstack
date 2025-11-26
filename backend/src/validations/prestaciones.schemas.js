// src/validations/prestaciones.schemas.js
import Joi from "joi";

export const prestacionCreateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required(),
  especialidadId: Joi.string().required(), // ObjectId como string
  descripcion: Joi.string().max(255).allow(null, "").optional()
});

export const prestacionUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).optional(),
  especialidadId: Joi.string().optional(),
  descripcion: Joi.string().max(255).allow(null, "").optional()
}).min(1);
