import prestacionesService from "../services/prestaciones.service.js";

class PrestacionesController {
  async crear(req, res, next) {
    try {
      const prest = await prestacionesService.crearPrestacion(req.body);
      res.status(201).json(prest);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const filtros = {};
      if (req.query.especialidadId) {
        filtros.especialidadId = req.query.especialidadId;
      }

      const lista = await prestacionesService.listarPrestaciones(filtros);
      res.json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req, res, next) {
    try {
      const prest = await prestacionesService.obtenerPorId(req.params.id);
      res.json(prest);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const prest = await prestacionesService.actualizarPrestacion(
        req.params.id,
        req.body
      );
      res.json(prest);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      await prestacionesService.eliminarPrestacion(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new PrestacionesController();
