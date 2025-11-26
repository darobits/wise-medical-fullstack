// src/schemas/agenda.schema.js
import Joi from "joi";

const diasSemanaValidos = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

export const agendaCreateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required(),

  profesionalId: Joi.string().required(),
  especialidadId: Joi.string().required(),

  prestacionesIds: Joi.array().items(Joi.string()).min(1).required(),
  prestacionPrincipalId: Joi.string().required(),

  diasSemana: Joi.array()
    .items(Joi.string().valid(...diasSemanaValidos))
    .min(1)
    .required(),

  horaInicio: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "horaInicio debe tener formato HH:mm"
    }),

  horaFin: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "horaFin debe tener formato HH:mm"
    }),

  duracionMinutos: Joi.number().integer().min(5).max(480).required(),

  limiteProspectivoDias: Joi.number().integer().min(1).max(365).required(),

  activa: Joi.boolean().default(true)
});

export const agendaUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).optional(),
  profesionalId: Joi.string().optional(),
  especialidadId: Joi.string().optional(),
  prestacionesIds: Joi.array().items(Joi.string()).min(1).optional(),
  prestacionPrincipalId: Joi.string().optional(),
  diasSemana: Joi.array()
    .items(Joi.string().valid(...diasSemanaValidos))
    .min(1)
    .optional(),
  horaInicio: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional(),
  horaFin: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional(),
  duracionMinutos: Joi.number().integer().min(5).max(480).optional(),
  limiteProspectivoDias: Joi.number().integer().min(1).max(365).optional(),
  activa: Joi.boolean().optional()
}).min(1);
