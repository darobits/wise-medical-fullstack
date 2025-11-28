import Joi from "joi";

export const turnoCreateSchema = Joi.object({
  agendaId: Joi.string().required(),
  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  hora: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),

  // NUEVO: podemos mandar pacienteId directamente,
  // o si no viene, mandamos nombre + documento.
  pacienteId: Joi.string().optional(),

  pacienteNombre: Joi.string().when("pacienteId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  }),

  pacienteDocumento: Joi.string().when("pacienteId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  }),

  pacienteEmail: Joi.string().email().optional(),
  pacienteTelefono: Joi.string().max(30).optional(),

  prestacionesExtraIds: Joi.array().items(Joi.string()).default([])
});
