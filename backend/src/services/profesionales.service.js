import { ProfesionalModel } from "../models/mongo/profesional.model.js";
import { EspecialidadModel } from "../models/mongo/especialidad.model.js";

class ProfesionalesService {
  async crearProfesional(data) {
    const esp = await EspecialidadModel.findById(data.especialidadId);
    if (!esp) {
      const err = new Error("La especialidad asociada no existe");
      err.status = 400;
      throw err;
    }

    const existeMatricula = await ProfesionalModel.findOne({
      matricula: data.matricula
    });
    if (existeMatricula) {
      const err = new Error("Ya existe un profesional con esa matrícula");
      err.status = 400;
      throw err;
    }

    const profesional = await ProfesionalModel.create(data);
    return profesional;
  }

  async listarProfesionales(filtros = {}) {
    const query = {};

    if (filtros.especialidadId) {
      query.especialidadId = filtros.especialidadId;
    }
    if (filtros.activo !== undefined) {
      query.activo = filtros.activo;
    }

    return await ProfesionalModel.find(query)
      .populate("especialidadId", "nombre")
      .sort({ nombreCompleto: 1 });
  }

  async obtenerPorId(id) {
    const profesional = await ProfesionalModel.findById(id).populate(
      "especialidadId",
      "nombre"
    );
    if (!profesional) {
      const err = new Error("Profesional no encontrado");
      err.status = 404;
      throw err;
    }
    return profesional;
  }

  async actualizarProfesional(id, data) {
    if (data.especialidadId) {
      const esp = await EspecialidadModel.findById(data.especialidadId);
      if (!esp) {
        const err = new Error("La especialidad asociada no existe");
        err.status = 400;
        throw err;
      }
    }

    const profesional = await ProfesionalModel.findByIdAndUpdate(id, data, {
      new: true
    }).populate("especialidadId", "nombre");

    if (!profesional) {
      const err = new Error("Profesional no encontrado");
      err.status = 404;
      throw err;
    }

    return profesional;
  }

  async eliminarProfesional(id) {
    const profesional = await ProfesionalModel.findByIdAndDelete(id);
    if (!profesional) {
      const err = new Error("Profesional no encontrado");
      err.status = 404;
      throw err;
    }
    return profesional;
  }
}

export default new ProfesionalesService();
