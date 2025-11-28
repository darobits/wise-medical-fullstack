import { TurnoModel } from "../models/mongo/turno.model.js";
import { AgendaModel } from "../models/mongo/agenda.model.js";
import { PrestacionModel } from "../models/mongo/prestacion.model.js";
import PacientesService from "./pacientes.service.js";
import {
  parseDate,
  formatDate,
  getDiaSemanaCode,
  addMinutesToTime,
  isTimeLessOrEqual
} from "../utils/date.utils.js";

class TurnosService {
  // 🔹 Obtener slots libres para una agenda (CON FRANJAS)
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
    const fechaInicio = fechaDesde < fechaHoy ? fechaHoy : fechaDesde;

    // fecha fin = fechaInicio + limiteProspectivoDias
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + agenda.limiteProspectivoDias);

    // 🔹 Turnos ya reservados
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

      // 🔹 Obtenemos las franjas del día
      let franjasDia = [];

      if (Array.isArray(agenda.franjas) && agenda.franjas.length > 0) {
        franjasDia = agenda.franjas.filter((f) => f.dia === diaCode);
      } else if (
        Array.isArray(agenda.diasSemana) &&
        agenda.diasSemana.includes(diaCode) &&
        agenda.horaInicio &&
        agenda.horaFin
      ) {
        // 🔹 compatibilidad con modelo viejo
        franjasDia = [
          {
            dia: diaCode,
            horaInicio: agenda.horaInicio,
            horaFin: agenda.horaFin
          }
        ];
      }

      if (franjasDia.length === 0) continue;

      const fechaStr = formatDate(fecha);

      for (const franja of franjasDia) {
        let horaActual = franja.horaInicio;

        while (isTimeLessOrEqual(horaActual, franja.horaFin)) {
          const key = `${fechaStr}|${horaActual}`;

          if (!ocupadosSet.has(key)) {
            slots.push({
              fecha: fechaStr,
              hora: horaActual
            });
          }

          horaActual = addMinutesToTime(
            horaActual,
            agenda.duracionMinutos
          );
        }
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

  // 🔹 Crear turno (usa franjas + pacientes)
  async crearTurno(data, usuarioContexto) {
    const {
      agendaId,
      fecha,
      hora,
      // nuevo: puede venir pacienteId
      pacienteId,
      // o bien estos datos para buscar/crear
      pacienteNombre,
      pacienteDocumento,
      pacienteEmail,
      pacienteTelefono,
      prestacionesExtraIds
    } = data;

    const agenda = await AgendaModel.findById(agendaId)
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre");

    if (!agenda || !agenda.activa) {
      const err = new Error("Agenda no encontrada o inactiva");
      err.status = 400;
      throw err;
    }

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

    const diaCode = getDiaSemanaCode(fechaTurno);

    // 🔹 Obtenemos franjas válidas para el día
    let franjasDia = [];

    if (Array.isArray(agenda.franjas) && agenda.franjas.length > 0) {
      franjasDia = agenda.franjas.filter((f) => f.dia === diaCode);
    } else if (
      Array.isArray(agenda.diasSemana) &&
      agenda.diasSemana.includes(diaCode) &&
      agenda.horaInicio &&
      agenda.horaFin
    ) {
      franjasDia = [
        {
          dia: diaCode,
          horaInicio: agenda.horaInicio,
          horaFin: agenda.horaFin
        }
      ];
    }

    if (franjasDia.length === 0) {
      const err = new Error("La agenda no atiende en el día seleccionado");
      err.status = 400;
      throw err;
    }

    // 🔹 Validar que el horario esté dentro de alguna franja
    const franjaValida = franjasDia.find(
      (f) =>
        isTimeLessOrEqual(f.horaInicio, hora) &&
        isTimeLessOrEqual(hora, f.horaFin)
    );

    if (!franjaValida) {
      const err = new Error(
        "El horario no está dentro de ninguna franja válida"
      );
      err.status = 400;
      throw err;
    }

    // 🔹 Validar alineación con duración
    const horariosValidos = [];
    let h = franjaValida.horaInicio;

    while (isTimeLessOrEqual(h, franjaValida.horaFin)) {
      horariosValidos.push(h);
      h = addMinutesToTime(h, agenda.duracionMinutos);
    }

    if (!horariosValidos.includes(hora)) {
      const err = new Error(
        "El horario no coincide con los intervalos de la agenda"
      );
      err.status = 400;
      throw err;
    }

    // 🔹 Validar que no esté reservado
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

    // 🔹 Resolver paciente (por id o por documento)
    let paciente;
    if (pacienteId) {
      paciente = await PacientesService.obtenerPorId(pacienteId);
    } else {
      paciente = await PacientesService.buscarPorDocumentoOCrear({
        documento: pacienteDocumento,
        nombreCompleto: pacienteNombre,
        email: pacienteEmail,
        telefono: pacienteTelefono
      });
    }

    // 🔹 Validar prestaciones extra
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

      extrasLimpias = prestacionesExtraIds.filter(
        (id) =>
          id.toString() !==
          agenda.prestacionPrincipalId._id.toString()
      );
    }

    const turno = await TurnoModel.create({
      agendaId,
      fecha,
      hora,
      pacienteId: paciente._id,
      pacienteNombre: paciente.nombreCompleto,
      pacienteDocumento: paciente.documento,
      prestacionPrincipalId: agenda.prestacionPrincipalId._id,
      prestacionesExtraIds: extrasLimpias,
      creadoPorUsuarioId: usuarioContexto?.id,
      estado: "RESERVADO"
    });

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
      prestacionesExtraIds: extrasLimpias,
      paciente: {
        id: paciente._id,
        nombreCompleto: paciente.nombreCompleto,
        documento: paciente.documento,
        email: paciente.email,
        telefono: paciente.telefono
      }
    };
  }

  async listarTurnos(filtros = {}) {
    const query = {};

    if (filtros.agendaId) query.agendaId = filtros.agendaId;
    if (filtros.fecha) query.fecha = filtros.fecha;
    if (filtros.estado) query.estado = filtros.estado;

    return TurnoModel.find(query)
      .populate("agendaId", "nombre")
      .populate("prestacionPrincipalId", "nombre")
      .sort({ fecha: 1, hora: 1 });
  }
}

export default new TurnosService();
