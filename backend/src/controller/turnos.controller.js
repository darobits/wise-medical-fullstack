import turnosService from "../services/turnos.service.js";

class TurnosController {
  // GET /api/turnos/slots/:agendaId?fechaDesde=YYYY-MM-DD
  async obtenerSlots(req, res, next) {
    try {
      const { agendaId } = req.params;
      const { fechaDesde } = req.query;

      const data = await turnosService.obtenerSlots(agendaId, fechaDesde);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/turnos
  async crearTurno(req, res, next) {
    try {
      const turno = await turnosService.crearTurno(req.body, req.user);
      res.status(201).json(turno);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/turnos
  async listarTurnos(req, res, next) {
    try {
      const filtros = {
        agendaId: req.query.agendaId,
        fecha: req.query.fecha,
        estado: req.query.estado
      };

      const turnos = await turnosService.listarTurnos(filtros);
      res.json(turnos);
    } catch (error) {
      next(error);
    }
  }
}

export default new TurnosController();
