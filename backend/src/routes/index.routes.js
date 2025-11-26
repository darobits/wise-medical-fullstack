// src/routes/index.routes.js
import express from "express";

const router = express.Router();

/**
 * @openapi
 * /api/ping:
 *   get:
 *     tags:
 *       - Health
 *     summary: Chequeo de estado del servidor
 *     responses:
 *       200:
 *         description: Respuesta correcta
 */
router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

export default router;
