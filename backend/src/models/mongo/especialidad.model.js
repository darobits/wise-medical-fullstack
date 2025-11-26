import mongoose from "mongoose";

const EspecialidadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String }
  },
  { timestamps: true }
);

export const EspecialidadModel = mongoose.model(
  "Especialidad",
  EspecialidadSchema
);
