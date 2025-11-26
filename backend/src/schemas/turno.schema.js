// src/schemas/turno.schema.js
import Joi from "joi";

export const turnoCreateSchema = Joi.object({
  agendaId: Joi.string().required(),

  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener formato YYYY-MM-DD"
    }),

  hora: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La hora debe tener formato HH:mm"
    }),

  pacienteNombre: Joi.string().min(3).max(150).required(),
  pacienteDocumento: Joi.string().min(3).max(50).required(),

  prestacionesExtraIds: Joi.array().items(Joi.string()).optional()
});
