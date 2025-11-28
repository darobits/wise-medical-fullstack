import express from "express";
import PacientesController from "../controller/pacientes.controller.js";
import { validateToken, authorizeRoles } from "../middleware/jwt.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { pacienteCreateSchema } from "../schemas/paciente.schema.js";

const router = express.Router();

// Todas requieren estar logueado
router.use(validateToken);

// GET /api/pacientes?documento=...&nombre=...
router.get(
  "/",
  (req, res, next) => PacientesController.buscar(req, res, next)
);

// GET /api/pacientes/:id
router.get(
  "/:id",
  (req, res, next) => PacientesController.obtenerPorId(req, res, next)
);

// POST /api/pacientes
router.post(
  "/",
  authorizeRoles("ADMIN", "GESTOR", "TURNERO"),
  validateBody(pacienteCreateSchema),
  (req, res, next) => PacientesController.crear(req, res, next)
);

export default router;
