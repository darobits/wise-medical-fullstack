// src/config/config.js
import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  mongoDbName: process.env.MONGO_DB_NAME,
  persistenceType: process.env.PERSISTENCE_TYPE || "MONGO"
};

export default config;
