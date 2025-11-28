import PacientesService from "../services/pacientes.service.js";

class PacientesController {
  async crear(req, res, next) {
    try {
      const paciente = await PacientesService.crearPaciente(req.body);
      res.status(201).json(paciente);
    } catch (err) {
      next(err);
    }
  }

  async buscar(req, res, next) {
    try {
      const { documento, nombre } = req.query;
      const pacientes = await PacientesService.buscar({ documento, nombre });
      res.json(pacientes);
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const paciente = await PacientesService.obtenerPorId(req.params.id);
      res.json(paciente);
    } catch (err) {
      next(err);
    }
  }
}

export default new PacientesController();
