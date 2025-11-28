import mongoose from "mongoose";

const diasSemanaEnum = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const FranjaSchema = new mongoose.Schema(
  {
    dia: {
      type: String,
      enum: diasSemanaEnum,
      required: true
    },
    horaInicio: {
      type: String, // "HH:mm"
      required: true
    },
    horaFin: {
      type: String, // "HH:mm"
      required: true
    }
  },
  { _id: false }
);

const AgendaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },

    profesionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profesional",
      required: true
    },

    especialidadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
      required: true
    },

    prestacionesIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prestacion",
        required: true
      }
    ],

    prestacionPrincipalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestacion",
      required: true
    },

    // 🔹 NUEVO: múltples franjas por día
    franjas: {
      type: [FranjaSchema],
      default: []
    },

    // 🔹 LEGACY (para compatibilidad con datos viejos / código viejo)
    diasSemana: [
      {
        type: String,
        enum: diasSemanaEnum
      }
    ],

    horaInicio: { type: String }, // "08:00"
    horaFin: { type: String }, // "12:00"

    duracionMinutos: {
      type: Number,
      required: true // ej. 20, 30
    },

    limiteProspectivoDias: { type: Number, default: 30 }, // p.ej. 10, 30

    activa: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AgendaModel = mongoose.model("Agenda", AgendaSchema);
