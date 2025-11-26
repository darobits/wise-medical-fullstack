import { TurnoModel } from "../models/mongo/turno.model.js";
import { AgendaModel } from "../models/mongo/agenda.model.js";
import { PrestacionModel } from "../models/mongo/prestacion.model.js";
import {
  parseDate,
  formatDate,
  getDiaSemanaCode,
  addMinutesToTime,
  isTimeLessOrEqual
} from "../utils/date.utils.js";

class TurnosService {
  // Generar slots disponibles para una agenda
  async obtenerSlots(agendaId, fechaDesdeStr) {
    const agenda = await AgendaModel.findById(agendaId)
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre");

    if (!agenda || !agenda.activa) {
      const err = new Error("Agenda no encontrada o inactiva");
      err.status = 404;
      throw err;
    }

    const hoy = new Date();
    const fechaHoy = parseDate(formatDate(hoy));

    const fechaDesde = fechaDesdeStr ? parseDate(fechaDesdeStr) : fechaHoy;
    const fechaInicio =
      fechaDesde < fechaHoy ? fechaHoy : fechaDesde;

    // fecha fin = fechaInicio + limiteProspectivoDias
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + agenda.limiteProspectivoDias);

    // Traemos los turnos ya tomados en ese rango
    const turnosExistentes = await TurnoModel.find({
      agendaId,
      fecha: {
        $gte: formatDate(fechaInicio),
        $lte: formatDate(fechaFin)
      },
      estado: "RESERVADO"
    });

    const ocupadosSet = new Set(
      turnosExistentes.map((t) => `${t.fecha}|${t.hora}`)
    );

    const slots = [];

    for (
      let fecha = new Date(fechaInicio);
      fecha <= fechaFin;
      fecha.setDate(fecha.getDate() + 1)
    ) {
      const diaCode = getDiaSemanaCode(fecha);
      if (!agenda.diasSemana.includes(diaCode)) continue;

      const fechaStr = formatDate(fecha);
      let horaActual = agenda.horaInicio;

      while (isTimeLessOrEqual(horaActual, agenda.horaFin)) {
        const key = `${fechaStr}|${horaActual}`;
        if (!ocupadosSet.has(key)) {
          slots.push({
            fecha: fechaStr,
            hora: horaActual
          });
        }
        horaActual = addMinutesToTime(horaActual, agenda.duracionMinutos);
      }
    }

    return {
      agenda: {
        id: agenda._id,
        nombre: agenda.nombre,
        profesional: agenda.profesionalId,
        especialidad: agenda.especialidadId,
        prestacionPrincipal: agenda.prestacionPrincipalId
      },
      slots
    };
  }

  // Crear turno
  async crearTurno(data, usuarioContexto) {
    const { agendaId, fecha, hora, pacienteNombre, pacienteDocumento, prestacionesExtraIds } =
      data;

    const agenda = await AgendaModel.findById(agendaId)
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre");

    if (!agenda || !agenda.activa) {
      const err = new Error("Agenda no encontrada o inactiva");
      err.status = 400;
      throw err;
    }

    // Validar fecha dentro de límite prospectivo
    const hoy = parseDate(formatDate(new Date()));
    const fechaTurno = parseDate(fecha);

    if (fechaTurno < hoy) {
      const err = new Error("No se pueden dar turnos en fechas pasadas");
      err.status = 400;
      throw err;
    }

    const fechaMax = new Date(hoy);
    fechaMax.setDate(fechaMax.getDate() + agenda.limiteProspectivoDias);

    if (fechaTurno > fechaMax) {
      const err = new Error(
        `La fecha excede el límite prospectivo de la agenda (${agenda.limiteProspectivoDias} días)`
      );
      err.status = 400;
      throw err;
    }

    // Validar día de semana
    const diaCode = getDiaSemanaCode(fechaTurno);
    if (!agenda.diasSemana.includes(diaCode)) {
      const err = new Error("La agenda no atiende en el día seleccionado");
      err.status = 400;
      throw err;
    }

    // Validar horario dentro del rango de la agenda y múltiplo de duracionMinutos
    if (!isTimeLessOrEqual(agenda.horaInicio, hora) || !isTimeLessOrEqual(hora, agenda.horaFin)) {
      const err = new Error("El horario no está dentro de la franja de la agenda");
      err.status = 400;
      throw err;
    }

    // Validar que el horario esté alineado a la duración de la agenda
    const generarHorariosValidos = () => {
      const horarios = [];
      let h = agenda.horaInicio;
      while (isTimeLessOrEqual(h, agenda.horaFin)) {
        horarios.push(h);
        h = addMinutesToTime(h, agenda.duracionMinutos);
      }
      return horarios;
    };

    const horariosValidos = generarHorariosValidos();
    if (!horariosValidos.includes(hora)) {
      const err = new Error(
        "El horario no coincide con los intervalos de la agenda"
      );
      err.status = 400;
      throw err;
    }

    // Validar que no haya turno tomado en ese slot
    const existeTurno = await TurnoModel.findOne({
      agendaId,
      fecha,
      hora,
      estado: "RESERVADO"
    });

    if (existeTurno) {
      const err = new Error("El turno ya está reservado en ese horario");
      err.status = 400;
      throw err;
    }

    // Validar prestaciones extra: deben pertenecer a la agenda
    let extrasLimpias = [];
    if (prestacionesExtraIds && prestacionesExtraIds.length > 0) {
      const setAgendaPrestaciones = new Set(
        agenda.prestacionesIds.map((p) => p._id.toString())
      );

      const noValidas = prestacionesExtraIds.filter(
        (id) => !setAgendaPrestaciones.has(id.toString())
      );

      if (noValidas.length > 0) {
        const err = new Error(
          "Alguna de las prestaciones extra no pertenece a la agenda"
        );
        err.status = 400;
        throw err;
      }

      // No incluir la prestacion principal como extra
      extrasLimpias = prestacionesExtraIds.filter(
        (id) => id.toString() !== agenda.prestacionPrincipalId._id.toString()
      );
    }

    const turno = await TurnoModel.create({
      agendaId,
      fecha,
      hora,
      pacienteNombre,
      pacienteDocumento,
      prestacionPrincipalId: agenda.prestacionPrincipalId._id,
      prestacionesExtraIds: extrasLimpias,
      creadoPorUsuarioId: usuarioContexto?.id,
      estado: "RESERVADO"
    });

    // “Ticket” del turno: devolvemos info principal
    const prestacionPrincipal = await PrestacionModel.findById(
      agenda.prestacionPrincipalId._id
    );

    return {
      id: turno._id,
      fecha: turno.fecha,
      hora: turno.hora,
      pacienteNombre: turno.pacienteNombre,
      pacienteDocumento: turno.pacienteDocumento,
      agenda: {
        id: agenda._id,
        nombre: agenda.nombre
      },
      profesional: agenda.profesionalId,
      especialidad: agenda.especialidadId,
      prestacionPrincipal: {
        id: prestacionPrincipal._id,
        nombre: prestacionPrincipal.nombre
      },
      // Guardamos extras por si más adelante los usás
      prestacionesExtraIds: extrasLimpias
    };
  }

  async listarTurnos(filtros = {}) {
    const query = {};

    if (filtros.agendaId) query.agendaId = filtros.agendaId;
    if (filtros.fecha) query.fecha = filtros.fecha;
    if (filtros.estado) query.estado = filtros.estado;

    const turnos = await TurnoModel.find(query)
      .populate("agendaId", "nombre")
      .populate("prestacionPrincipalId", "nombre")
      .sort({ fecha: 1, hora: 1 });

    return turnos;
  }
}

export default new TurnosService();
