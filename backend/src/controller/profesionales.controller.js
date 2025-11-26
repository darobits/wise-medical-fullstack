import profesionalesService from "../services/profesionales.service.js";

class ProfesionalesController {
  async crear(req, res, next) {
    try {
      const profesional = await profesionalesService.crearProfesional(req.body);
      res.status(201).json(profesional);
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
      if (req.query.activo !== undefined) {
        filtros.activo = req.query.activo === "true";
      }

      const lista = await profesionalesService.listarProfesionales(filtros);
      res.json(lista);
    } catch (error) {
      next(error);
    }
  }

  async obtener(req, res, next) {
    try {
      const profesional = await profesionalesService.obtenerPorId(req.params.id);
      res.json(profesional);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const profesional = await profesionalesService.actualizarProfesional(
        req.params.id,
        req.body
      );
      res.json(profesional);
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      await profesionalesService.eliminarProfesional(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfesionalesController();
