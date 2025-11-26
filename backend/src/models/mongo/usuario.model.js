import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    rol: {
      type: String,
      enum: ["ADMIN", "GESTOR", "TURNERO"],
      default: "TURNERO"
    }
  },
  { timestamps: true }
);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
