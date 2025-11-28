import mongoose from "mongoose";

const PacienteSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      trim: true
    },
    // DNI / CUIT / pasaporte, lo tratamos genéricamente como "documento"
    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    direccion: {
      type: String,
      trim: true
    },
    obraSocial: {
      type: String,
      trim: true
    },
    numeroAfiliado: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: "pacientes"
  }
);

export const PacienteModel = mongoose.model("Paciente", PacienteSchema);
