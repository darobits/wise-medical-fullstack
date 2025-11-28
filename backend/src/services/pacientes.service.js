import { PacienteModel } from "../models/mongo/paciente.model.js";

class PacientesService {
  async crearPaciente(data) {
    const existente = await PacienteModel.findOne({
      documento: data.documento.trim()
    });

    if (existente) {
      const err = new Error("Ya existe un paciente con ese documento");
      err.status = 400;
      throw err;
    }

    const paciente = await PacienteModel.create({
      nombreCompleto: data.nombreCompleto,
      documento: data.documento,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      obraSocial: data.obraSocial,
      numeroAfiliado: data.numeroAfiliado
    });

    return paciente;
  }

  async buscar({ documento, nombre }) {
    const query = {};

    if (documento) {
      query.documento = documento.trim();
    } else if (nombre) {
      query.nombreCompleto = new RegExp(nombre.trim(), "i");
    }

    const pacientes = await PacienteModel.find(query)
      .sort({ nombreCompleto: 1 })
      .lean();

    return pacientes;
  }

  async obtenerPorId(id) {
    const paciente = await PacienteModel.findById(id).lean();
    if (!paciente) {
      const err = new Error("Paciente no encontrado");
      err.status = 404;
      throw err;
    }
    return paciente;
  }

  // 👉 helper para turnos: buscar por documento o crear
  async buscarPorDocumentoOCrear(data) {
    if (!data.documento) {
      const err = new Error(
        "Se requiere el documento del paciente para crear el turno"
      );
      err.status = 400;
      throw err;
    }

    let paciente = await PacienteModel.findOne({
      documento: data.documento.trim()
    });

    if (!paciente) {
      paciente = await PacienteModel.create({
        nombreCompleto: data.nombreCompleto,
        documento: data.documento,
        email: data.email,
        telefono: data.telefono
      });
    } else {
      // Opcional: actualizar básicos si vienen distintos
      const updates = {};
      if (data.nombreCompleto && data.nombreCompleto !== paciente.nombreCompleto) {
        updates.nombreCompleto = data.nombreCompleto;
      }
      if (data.email && data.email !== paciente.email) {
        updates.email = data.email;
      }
      if (data.telefono && data.telefono !== paciente.telefono) {
        updates.telefono = data.telefono;
      }

      if (Object.keys(updates).length > 0) {
        paciente.set(updates);
        await paciente.save();
      }
    }

    return paciente;
  }
}

export default new PacientesService();
