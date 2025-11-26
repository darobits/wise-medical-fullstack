import mongoose from "mongoose";

const TurnoSchema = new mongoose.Schema(
  {
    agendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      required: true
    },

    // Fecha del turno (solo día, en formato YYYY-MM-DD)
    fecha: {
      type: String,
      required: true
    },

    // Hora del turno (HH:mm)
    hora: {
      type: String,
      required: true
    },

    // Paciente (simplificado, sin entidad aparte por ahora)
    pacienteNombre: { type: String, required: true },
    pacienteDocumento: { type: String, required: true },

    // Prestación principal (se copia de la agenda)
    prestacionPrincipalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestacion",
      required: true
    },

    // Prestaciones adicionales seleccionadas (si las hay)
    prestacionesExtraIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prestacion"
      }
    ],

    // Usuario que dio el turno (turnero/gestor/admin)
    creadoPorUsuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    },

    estado: {
      type: String,
      enum: ["RESERVADO", "CANCELADO"],
      default: "RESERVADO"
    }
  },
  { timestamps: true }
);

// No se pueden duplicar turnos en mismo horario de la misma agenda
TurnoSchema.index(
  { agendaId: 1, fecha: 1, hora: 1 },
  { unique: true }
);

export const TurnoModel = mongoose.model("Turno", TurnoSchema);
