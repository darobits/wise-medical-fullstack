import express from "express";
import especialidadesController from "../controller/especialidades.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  createEspecialidadSchema,
  updateEspecialidadSchema
} from "../schemas/especialidad.schema.js";
import {
  validateToken,
  authorizeRoles
} from "../middleware/jwt.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/especialidades:
 *   get:
 *     tags:
 *       - Especialidades
 *     summary: Listar especialidades
 *   post:
 *     tags:
 *       - Especialidades
 *     summary: Crear especialidad (solo ADMIN)
 */
router.get("/", validateToken, (req, res, next) =>
  especialidadesController.listar(req, res, next)
);

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(createEspecialidadSchema),
  (req, res, next) => especialidadesController.crear(req, res, next)
);

/**
 * @openapi
 * /api/especialidades/{id}:
 *   get:
 *     tags:
 *       - Especialidades
 *   put:
 *     tags:
 *       - Especialidades
 *   delete:
 *     tags:
 *       - Especialidades
 */
router.get("/:id", validateToken, (req, res, next) =>
  especialidadesController.obtener(req, res, next)
);

router.put(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(updateEspecialidadSchema),
  (req, res, next) => especialidadesController.actualizar(req, res, next)
);

router.delete(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  (req, res, next) => especialidadesController.eliminar(req, res, next)
);

export default router;
