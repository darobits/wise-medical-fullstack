import express from "express";
import agendasController from "../controller/agendas.controller.js";
import { validateToken, authorizeRoles } from "../middleware/jwt.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  agendaCreateSchema,
  agendaUpdateSchema
} from "../schemas/agenda.schema.js";

const router = express.Router();

/**
 * @openapi
 * /api/agendas:
 *   get:
 *     tags:
 *       - Agendas
 *     summary: Buscar / listar agendas
 *   post:
 *     tags:
 *       - Agendas
 *     summary: Crear agenda (ADMIN y GESTOR)
 */

router.get(
  "/",
  validateToken,
  (req, res, next) => agendasController.listar(req, res, next)
);

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN", "GESTOR"),
  validateBody(agendaCreateSchema),   // 👈 AGREGADO
  (req, res, next) => agendasController.crear(req, res, next)
);

router.get(
  "/:id",
  validateToken,
  (req, res, next) => agendasController.obtener(req, res, next)
);

router.put(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN", "GESTOR"),
  validateBody(agendaUpdateSchema),   // 👈 AGREGADO
  (req, res, next) => agendasController.actualizar(req, res, next)
);

router.delete(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN", "GESTOR"),
  (req, res, next) => agendasController.eliminar(req, res, next)
);

export default router;
