import express from "express";
import turnosController from "../controller/turnos.controller.js";
import { validateToken, authorizeRoles } from "../middleware/jwt.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { turnoCreateSchema } from "../schemas/turno.schema.js";

const router = express.Router();


/**
 * @openapi
 * /api/turnos/slots/{agendaId}:
 *   get:
 *     tags:
 *       - Turnos
 *     summary: Obtener slots disponibles para una agenda
 *     parameters:
 *       - in: path
 *         name: agendaId
 *         required: true
 *       - in: query
 *         name: fechaDesde
 *         required: false
 *         description: Fecha desde (YYYY-MM-DD). Si no se envía, toma hoy.
 */

router.get(
  "/slots/:agendaId",
  validateToken,
  (req, res, next) => turnosController.obtenerSlots(req, res, next)
);

/**
 * @openapi
 * /api/turnos:
 *   get:
 *     tags:
 *       - Turnos
 *     summary: Listar turnos
 *   post:
 *     tags:
 *       - Turnos
 *     summary: Crear turno (ADMIN, GESTOR, TURNERO)
 */

router.get(
  "/",
  validateToken,
  (req, res, next) => turnosController.listarTurnos(req, res, next)
);

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN", "GESTOR", "TURNERO"),
  validateBody(turnoCreateSchema),           
  (req, res, next) => turnosController.crearTurno(req, res, next)
);

export default router;
