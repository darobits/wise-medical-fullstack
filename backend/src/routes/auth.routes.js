import express from "express";
import authController from "../controller/auth.controller.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { loginLimiter } from "../middleware/rateLimit.middleware.js"; 

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login de usuario
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Login correcto
 */
router.post(
  "/login",
  loginLimiter,                  //  primero limitamos
  validateBody(loginSchema),     //  luego validamos body
  (req, res, next) => authController.login(req, res, next)
);

export default router;
