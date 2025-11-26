import "../src/config/config.js";
import { connectDB } from "../src/config/MongoDBConnection.js";
import bcrypt from "bcrypt";
import { UsuarioModel } from "../src/models/mongo/usuario.model.js";

const run = async () => {
  try {
    await connectDB();

    const email = "admin@tp2.com";

    const existe = await UsuarioModel.findOne({ email });
    if (existe) {
      console.log("Ya existe un admin con ese email");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    await UsuarioModel.create({
      nombre: "Admin TP2",
      email,
      passwordHash,
      rol: "ADMIN"
    });

    console.log("✅ Admin creado con éxito:");
    console.log("Email: admin@tp2.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error creando admin:", error);
    process.exit(1);
  }
};

run();
