import Joi from "joi";

export const pacienteCreateSchema = Joi.object({
  nombreCompleto: Joi.string().min(3).max(120).required(),
  documento: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().allow(null, ""),
  telefono: Joi.string().max(30).allow(null, ""),
  direccion: Joi.string().max(200).allow(null, ""),
  obraSocial: Joi.string().max(80).allow(null, ""),
  numeroAfiliado: Joi.string().max(80).allow(null, "")
});
