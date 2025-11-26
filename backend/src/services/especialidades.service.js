import { EspecialidadModel } from "../models/mongo/especialidad.model.js";

class EspecialidadesService {
  async crearEspecialidad(data) {
    const existe = await EspecialidadModel.findOne({ nombre: data.nombre });
    if (existe) {
      const err = new Error("Ya existe una especialidad con ese nombre");
      err.status = 400;
      throw err;
    }

    const esp = await EspecialidadModel.create(data);
    return esp;
  }

  async listarEspecialidades() {
    return await EspecialidadModel.find().sort({ nombre: 1 });
  }

  async obtenerPorId(id) {
    const esp = await EspecialidadModel.findById(id);
    if (!esp) {
      const err = new Error("Especialidad no encontrada");
      err.status = 404;
      throw err;
    }
    return esp;
  }

  async actualizarEspecialidad(id, data) {
    const esp = await EspecialidadModel.findByIdAndUpdate(id, data, {
      new: true
    });
    if (!esp) {
      const err = new Error("Especialidad no encontrada");
      err.status = 404;
      throw err;
    }
    return esp;
  }

  async eliminarEspecialidad(id) {
    const esp = await EspecialidadModel.findByIdAndDelete(id);
    if (!esp) {
      const err = new Error("Especialidad no encontrada");
      err.status = 404;
      throw err;
    }
    return esp;
  }
}

export default new EspecialidadesService();
