import mongoose from "mongoose";

const ProfesionalSchema = new mongoose.Schema(
  {
    nombreCompleto: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    especialidadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
      required: true
    },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ProfesionalModel = mongoose.model("Profesional", ProfesionalSchema);
