import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./src/config/MongoDBConnection.js";
import config from "./src/config/config.js";

import logger from "./src/config/logger.js"; // 👈 NUEVO

// Rutas
import indexRoutes from "./src/routes/index.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import especialidadesRoutes from "./src/routes/especialidades.routes.js";
import prestacionesRoutes from "./src/routes/prestaciones.routes.js";
import profesionalesRoutes from "./src/routes/profesionales.routes.js";
import agendasRoutes from "./src/routes/agendas.routes.js";
import turnosRoutes from "./src/routes/turnos.routes.js";

// Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.docs.js";

dotenv.config();

const app = express();
const PORT = config.port || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
connectDB()
  .then(() => {
    logger.info("Conectado a MongoDB Atlas"); // 👈 reemplaza console.log
  })
  .catch((err) => {
    logger.error("Error conectando a MongoDB Atlas", { error: err.message });
    process.exit(1);
  });

// Rutas principales
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/prestaciones", prestacionesRoutes);
app.use("/api/profesionales", profesionalesRoutes);
app.use("/api/agendas", agendasRoutes);
app.use("/api/turnos", turnosRoutes);

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  logger.error("Error en la petición", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });

  const status = err.status || 500;
  const message =
    status === 500 ? "Error interno del servidor" : err.message;

  res.status(status).json({
    message,
    // Si querés, en dev podés mandar más info:
    // error: process.env.NODE_ENV === "development" ? err : undefined
  });
});

// Levantar servidor
app.listen(PORT, () => {
  logger.info(`Servidor escuchando en http://localhost:${PORT}`);
});


export default app;