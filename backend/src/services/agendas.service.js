import { AgendaModel } from "../models/mongo/agenda.model.js";
import { ProfesionalModel } from "../models/mongo/profesional.model.js";
import { EspecialidadModel } from "../models/mongo/especialidad.model.js";
import { PrestacionModel } from "../models/mongo/prestacion.model.js";

class AgendasService {
  async crearAgenda(data) {
    const profesional = await ProfesionalModel.findById(data.profesionalId);
    if (!profesional) {
      const err = new Error("El profesional asociado no existe");
      err.status = 400;
      throw err;
    }

    const especialidad = await EspecialidadModel.findById(data.especialidadId);
    if (!especialidad) {
      const err = new Error("La especialidad asociada no existe");
      err.status = 400;
      throw err;
    }

    // Validar prestaciones
    if (!data.prestacionesIds || data.prestacionesIds.length === 0) {
      const err = new Error(
        "La agenda debe tener al menos una prestación asociada"
      );
      err.status = 400;
      throw err;
    }

    const prestaciones = await PrestacionModel.find({
      _id: { $in: data.prestacionesIds }
    });

    if (prestaciones.length !== data.prestacionesIds.length) {
      const err = new Error("Alguna de las prestaciones no existe");
      err.status = 400;
      throw err;
    }

    // Todas las prestaciones deben pertenecer a la misma especialidad
    const todasMismaEspecialidad = prestaciones.every(
      (p) => p.especialidadId.toString() === data.especialidadId
    );

    if (!todasMismaEspecialidad) {
      const err = new Error(
        "Todas las prestaciones deben pertenecer a la especialidad de la agenda"
      );
      err.status = 400;
      throw err;
    }

    // Prestación principal debe estar dentro de prestacionesIds
    if (
      !data.prestacionesIds
        .map((id) => id.toString())
        .includes(data.prestacionPrincipalId.toString())
    ) {
      const err = new Error(
        "La prestación principal debe estar incluida en la lista de prestaciones de la agenda"
      );
      err.status = 400;
      throw err;
    }

    // Podríamos validar formato de horaInicio/horaFin, pero lo dejamos simple por ahora

    const agenda = await AgendaModel.create(data);
    return agenda;
  }

  async listarAgendas(filtros = {}) {
    const query = {};

    if (filtros.nombre) {
      query.nombre = { $regex: filtros.nombre, $options: "i" };
    }
    if (filtros.especialidadId) {
      query.especialidadId = filtros.especialidadId;
    }
    if (filtros.profesionalId) {
      query.profesionalId = filtros.profesionalId;
    }
    if (filtros.prestacionId) {
      query.prestacionesIds = filtros.prestacionId;
    }
    if (filtros.activa !== undefined) {
      query.activa = filtros.activa;
    }

    return await AgendaModel.find(query)
      .populate("profesionalId", "nombreCompleto")
      .populate("especialidadId", "nombre")
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre")
      .sort({ nombre: 1 });
  }

  async obtenerPorId(id) {
    const agenda = await AgendaModel.findById(id)
      .populate("profesionalId", "nombreCompleto")
      .populate("especialidadId", "nombre")
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre");

    if (!agenda) {
      const err = new Error("Agenda no encontrada");
      err.status = 404;
      throw err;
    }
    return agenda;
  }

  async actualizarAgenda(id, data) {
    // Si cambian profesional/especialidad/prestaciones, revalidamos
    if (data.profesionalId) {
      const profesional = await ProfesionalModel.findById(data.profesionalId);
      if (!profesional) {
        const err = new Error("El profesional asociado no existe");
        err.status = 400;
        throw err;
      }
    }

    if (data.especialidadId) {
      const especialidad = await EspecialidadModel.findById(
        data.especialidadId
      );
      if (!especialidad) {
        const err = new Error("La especialidad asociada no existe");
        err.status = 400;
        throw err;
      }
    }

    if (data.prestacionesIds || data.prestacionPrincipalId) {
      const agendaActual = await AgendaModel.findById(id);
      if (!agendaActual) {
        const err = new Error("Agenda no encontrada");
        err.status = 404;
        throw err;
      }

      const especialidadId =
        data.especialidadId?.toString() ||
        agendaActual.especialidadId.toString();

      const prestacionesIds =
        data.prestacionesIds?.map((x) => x.toString()) ||
        agendaActual.prestacionesIds.map((x) => x.toString());

      const prestacionPrincipalId =
        data.prestacionPrincipalId?.toString() ||
        agendaActual.prestacionPrincipalId.toString();

      const prestaciones = await PrestacionModel.find({
        _id: { $in: prestacionesIds }
      });

      if (prestaciones.length !== prestacionesIds.length) {
        const err = new Error("Alguna de las prestaciones no existe");
        err.status = 400;
        throw err;
      }

      const todasMismaEspecialidad = prestaciones.every(
        (p) => p.especialidadId.toString() === especialidadId
      );

      if (!todasMismaEspecialidad) {
        const err = new Error(
          "Todas las prestaciones deben pertenecer a la especialidad de la agenda"
        );
        err.status = 400;
        throw err;
      }

      if (!prestacionesIds.includes(prestacionPrincipalId)) {
        const err = new Error(
          "La prestación principal debe estar incluida en la lista de prestaciones de la agenda"
        );
        err.status = 400;
        throw err;
      }
    }

    const agenda = await AgendaModel.findByIdAndUpdate(id, data, {
      new: true
    })
      .populate("profesionalId", "nombreCompleto")
      .populate("especialidadId", "nombre")
      .populate("prestacionPrincipalId", "nombre")
      .populate("prestacionesIds", "nombre");

    if (!agenda) {
      const err = new Error("Agenda no encontrada");
      err.status = 404;
      throw err;
    }

    return agenda;
  }

  async eliminarAgenda(id) {
    const agenda = await AgendaModel.findByIdAndDelete(id);
    if (!agenda) {
      const err = new Error("Agenda no encontrada");
      err.status = 404;
      throw err;
    }
    return agenda;
  }
}

export default new AgendasService();
