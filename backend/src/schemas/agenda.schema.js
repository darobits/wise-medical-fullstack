// src/schemas/agenda.schema.js
import Joi from "joi";

const diasSemanaValidos = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const franjaSchema = Joi.object({
  dia: Joi.string()
    .valid(...diasSemanaValidos)
    .required(),
  horaInicio: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  horaFin: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
});

export const agendaCreateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150).required(),

  profesionalId: Joi.string().required(),
  especialidadId: Joi.string().required(),

  prestacionesIds: Joi.array().items(Joi.string()).min(1).required(),
  prestacionPrincipalId: Joi.string().required(),

  duracionMinutos: Joi.number().integer().min(5).max(480).required(),
  limiteProspectivoDias: Joi.number().integer().min(1).max(365).default(30),
  activa: Joi.boolean().default(true),

  // ✅ nueva forma recomendada
  franjas: Joi.array().items(franjaSchema).min(1),

  // ✅ forma vieja (compatibilidad)
  diasSemana: Joi.array().items(Joi.string().valid(...diasSemanaValidos)),
  horaInicio: Joi.string().pattern(/^\d{2}:\d{2}$/),
  horaFin: Joi.string().pattern(/^\d{2}:\d{2}$/)
})
  .custom((value, helpers) => {
    // Debe venir o franjas, o el combo legacy
    const tieneFranjas = Array.isArray(value.franjas) && value.franjas.length > 0;
    const tieneLegacy =
      Array.isArray(value.diasSemana) &&
      value.diasSemana.length > 0 &&
      !!value.horaInicio &&
      !!value.horaFin;

    if (!tieneFranjas && !tieneLegacy) {
      return helpers.error("any.custom", {
        message:
          "Debés enviar al menos una franja o bien diasSemana + horaInicio + horaFin"
      });
    }

    return value;
  })
  .messages({
    "any.custom":
      "Debés enviar al menos una franja o bien diasSemana + horaInicio + horaFin"
  });

export const agendaUpdateSchema = Joi.object({
  nombre: Joi.string().min(3).max(150),

  profesionalId: Joi.string(),
  especialidadId: Joi.string(),

  prestacionesIds: Joi.array().items(Joi.string()).min(1),
  prestacionPrincipalId: Joi.string(),

  duracionMinutos: Joi.number().integer().min(5).max(480),
  limiteProspectivoDias: Joi.number().integer().min(1).max(365),
  activa: Joi.boolean(),

  franjas: Joi.array().items(franjaSchema).min(1),

  diasSemana: Joi.array().items(Joi.string().valid(...diasSemanaValidos)),
  horaInicio: Joi.string().pattern(/^\d{2}:\d{2}$/),
  horaFin: Joi.string().pattern(/^\d{2}:\d{2}$/)
}).min(1);
