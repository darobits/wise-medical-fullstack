import mongoose from "mongoose";

const PrestacionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    // relación con Especialidad
    especialidadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
      required: true
    }
  },
  { timestamps: true }
);

// Opcional: evitar prestaciones duplicadas por especialidad
PrestacionSchema.index({ nombre: 1, especialidadId: 1 }, { unique: true });

export const PrestacionModel = mongoose.model("Prestacion", PrestacionSchema);
