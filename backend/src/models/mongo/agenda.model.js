import mongoose from "mongoose";

const diasSemanaEnum = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

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
        ref: "Prestacion"
      }
    ],

    prestacionPrincipalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestacion",
      required: true
    },

    limiteProspectivoDias: { type: Number, default: 30 }, // p.ej. 10, 30

    duracionMinutos: { type: Number, default: 30 },

    diasSemana: [
      {
        type: String,
        enum: diasSemanaEnum
      }
    ],

    horaInicio: { type: String, required: true }, // "08:00"
    horaFin: { type: String, required: true },    // "12:00"

    activa: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AgendaModel = mongoose.model("Agenda", AgendaSchema);
