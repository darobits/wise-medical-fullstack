import express from "express";
import usersController from "../controller/users.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { createUserSchema } from "../schemas/user.schema.js";
import { validateToken, authorizeRoles } from "../middleware/jwt.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear usuario (solo ADMIN)
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Listar usuarios (solo ADMIN)
 */

router.post(
  "/",
  validateToken,
  authorizeRoles("ADMIN"),
  validateBody(createUserSchema),
  (req, res, next) => usersController.crearUsuario(req, res, next)
);

router.get(
  "/",
  validateToken,
  authorizeRoles("ADMIN"),
  (req, res, next) => usersController.listarUsuarios(req, res, next)
);

export default router;
