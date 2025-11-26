// src/config/MongoDBConnection.js
import mongoose from "mongoose";
import config from "./config.js";

const MONGO_URI =
  `mongodb+srv://${config.dbUser}:${config.dbPass}` +
  `@cluster-turnos.hvw6dku.mongodb.net/${config.mongoDbName}` +
  `?retryWrites=true&w=majority&appName=cluster-turnos`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Atlas conectado con éxito");
  } catch (error) {
    console.error("❌ Error conectando a Mongo:", error);
    process.exit(1);
  }
};
