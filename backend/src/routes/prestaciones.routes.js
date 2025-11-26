import express from "express";
import prestacionesController from "../controller/prestaciones.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import {
  createPrestacionSchema,
  updatePrestacionSchema
} from "../schemas/prestacion.schema.js";
import {
  validateToken,
  authorizeRoles
} from "../middleware/jwt.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/prestaciones:
 *   get:
 *     tags:
 *       - Prestaciones
 *     summary: Listar prestaciones (se puede filtrar por especialidadId)
 *   post:
 *     tags:
 *       - Prestaciones
 *     summary: Crear prestación (solo ADMIN)
 */
router.get("/", validateToken, (req, res, next) =>
  prestacionesController.listar(req, res, next)
);

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(createPrestacionSchema),
  (req, res, next) => prestacionesController.crear(req, res, next)
);

/**
 * @openapi
 * /api/prestaciones/{id}:
 *   get:
 *     tags:
 *       - Prestaciones
 *   put:
 *     tags:
 *       - Prestaciones
 *   delete:
 *     tags:
 *       - Prestaciones
 */
router.get("/:id", validateToken, (req, res, next) =>
  prestacionesController.obtener(req, res, next)
);

router.put(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(updatePrestacionSchema),
  (req, res, next) => prestacionesController.actualizar(req, res, next)
);

router.delete(
  "/:id",
  validateToken,
  authorizeRoles("ADMIN"),
  (req, res, next) => prestacionesController.eliminar(req, res, next)
);

export default router;
