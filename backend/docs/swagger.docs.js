// docs/swagger.docs.js
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "TP2 - API Turnos Médicos",
    version: "1.0.0",
    description: "Documentación del backend TP2 usando Swagger"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/**/*.js"] // Rutas donde Swagger buscará anotaciones
};

// 👇 IMPORTANTE: export nombrado
export const swaggerSpec = swaggerJSDoc(options);
