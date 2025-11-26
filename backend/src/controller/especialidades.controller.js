import especialidadesService from "../services/especialidades.service.js";

class EspecialidadesController {
  async crear(req, res, next) {
    try {
      const esp = await especialidadesService.crearEspecialidad(req.body);
      res.status(201).json(esp);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const lista = await especialidadesService.listarEspecialidades();
      res.json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req, res, next) {
    try {
      const esp = await especialidadesService.obtenerPorId(req.params.id);
      res.json(esp);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const esp = await especialidadesService.actualizarEspecialidad(
        req.params.id,
        req.body
      );
      res.json(esp);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      await especialidadesService.eliminarEspecialidad(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new EspecialidadesController();
