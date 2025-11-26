// src/middleware/validation.middleware.js
import Joi from "joi";

const buildErrorResponse = (error) => ({
  message: "Error de validación",
  details: error.details.map((d) => ({
    message: d.message,
    path: d.path.join(".")
  }))
});

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true // saca campos que no están en el schema
    });

    if (error) {
      return res.status(400).json(buildErrorResponse(error));
    }

    req.body = value; // body saneado
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json(buildErrorResponse(error));
    }

    req.query = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json(buildErrorResponse(error));
    }

    req.params = value;
    next();
  };
};
