import agendasService from "../services/agendas.service.js";

class AgendasController {
  async crear(req, res, next) {
    try {
      const agenda = await agendasService.crearAgenda(req.body);
      res.status(201).json(agenda);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const filtros = {};
      if (req.query.nombre) filtros.nombre = req.query.nombre;
      if (req.query.especialidadId) filtros.especialidadId = req.query.especialidadId;
      if (req.query.profesionalId) filtros.profesionalId = req.query.profesionalId;
      if (req.query.prestacionId) filtros.prestacionId = req.query.prestacionId;
      if (req.query.activa !== undefined) {
        filtros.activa = req.query.activa === "true";
      }

      const lista = await agendasService.listarAgendas(filtros);
      res.json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req, res, next) {
    try {
      const agenda = await agendasService.obtenerPorId(req.params.id);
      res.json(agenda);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const agenda = await agendasService.actualizarAgenda(
        req.params.id,
        req.body
      );
      res.json(agenda);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      await agendasService.eliminarAgenda(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new AgendasController();
