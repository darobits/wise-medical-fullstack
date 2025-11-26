import { PrestacionModel } from "../models/mongo/prestacion.model.js";
import { EspecialidadModel } from "../models/mongo/especialidad.model.js";

class PrestacionesService {
  async crearPrestacion(data) {
    const esp = await EspecialidadModel.findById(data.especialidadId);
    if (!esp) {
      const err = new Error("La especialidad asociada no existe");
      err.status = 400;
      throw err;
    }

    const prest = await PrestacionModel.create(data);
    return prest;
  }

  async listarPrestaciones(filtros = {}) {
    const query = {};

    if (filtros.especialidadId) {
      query.especialidadId = filtros.especialidadId;
    }

    return await PrestacionModel.find(query)
      .populate("especialidadId", "nombre")
      .sort({ nombre: 1 });
  }

  async obtenerPorId(id) {
    const prest = await PrestacionModel.findById(id).populate(
      "especialidadId",
      "nombre"
    );
    if (!prest) {
      const err = new Error("Prestación no encontrada");
      err.status = 404;
      throw err;
    }
    return prest;
  }

  async actualizarPrestacion(id, data) {
    if (data.especialidadId) {
      const esp = await EspecialidadModel.findById(data.especialidadId);
      if (!esp) {
        const err = new Error("La especialidad asociada no existe");
        err.status = 400;
        throw err;
      }
    }

    const prest = await PrestacionModel.findByIdAndUpdate(id, data, {
      new: true
    }).populate("especialidadId", "nombre");

    if (!prest) {
      const err = new Error("Prestación no encontrada");
      err.status = 404;
      throw err;
    }

    return prest;
  }

  async eliminarPrestacion(id) {
    const prest = await PrestacionModel.findByIdAndDelete(id);
    if (!prest) {
      const err = new Error("Prestación no encontrada");
      err.status = 404;
      throw err;
    }
    return prest;
  }
}

export default new PrestacionesService();
