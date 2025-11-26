import express from "express";
import profesionalesController from "../controller/profesionales.controller.js";
import { validateToken, authorizeRoles } from "../middleware/jwt.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  profesionalCreateSchema,
  profesionalUpdateSchema
} from "../schemas/profesional.schema.js";

const router = express.Router();

/**
 * @openapi
 * /api/profesionales:
 *   get:
 *     tags:
 *       - Profesionales
 *     summary: Listar profesionales
 *   post:
 *     tags:
 *       - Profesionales
 *     summary: Crear profesional (solo ADMIN)
 */
router.get(
  "/",
  validateToken,
  (req, res, next) => profesionalesController.listar(req, res, next)
);

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(profesionalCreateSchema),     
  (req, res, next) => profesionalesController.crear(req, res, next)
);

router.get(
  "/:id",
  validateToken,
  (req, res, next) => profesionalesController.obtener(req, res, next)
);

router.put(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(profesionalUpdateSchema),     
  (req, res, next) => profesionalesController.actualizar(req, res, next)
);

router.delete(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  (req, res, next) => profesionalesController.eliminar(req, res, next)
);

export default router;