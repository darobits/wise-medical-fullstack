import config from "../../config/config.js";

// ====== MODELOS MONGO ======
import { UsuarioModel } from "../mongo/usuario.model.js";
import { ProfesionalModel } from "../mongo/profesional.model.js";
import { EspecialidadModel } from "../mongo/especialidad.model.js";
import { PrestacionModel } from "../mongo/prestacion.model.js";
import { AgendaModel } from "../mongo/agenda.model.js";
import { TurnoModel } from "../mongo/turno.model.js";

// ====== DAOs FILE SYSTEM ======
import UsersFsDAO from "../fs/users.fs.dao.js";
import ProfesionalesFsDAO from "../fs/profesionales.fs.dao.js";
import EspecialidadesFsDAO from "../fs/especialidades.fs.dao.js";
import PrestacionesFsDAO from "../fs/prestaciones.fs.dao.js";
import AgendasFsDAO from "../fs/agendas.fs.dao.js";
import TurnosFsDAO from "../fs/turnos.fs.dao.js";

// ====== DAOs MEMORY ======
import UsersMemoryDAO from "../memory/users.memory.dao.js";
import ProfesionalesMemoryDAO from "../memory/profesionales.memory.dao.js";
import EspecialidadesMemoryDAO from "../memory/especialidades.memory.dao.js";
import PrestacionesMemoryDAO from "../memory/prestaciones.memory.dao.js";
import AgendasMemoryDAO from "../memory/agendas.memory.dao.js";
import TurnosMemoryDAO from "../memory/turnos.memory.dao.js";

const TYPE = (config.persistenceType || "MONGO").toUpperCase();

class DaoFactory {
  // ---------- USUARIOS ----------
  static getUsuariosModel() {
    switch (TYPE) {
      case "MEM":
        return new UsersMemoryDAO();
      case "FS":
        return new UsersFsDAO();
      case "MONGO":
      default:
        return UsuarioModel;
    }
  }

  // ---------- PROFESIONALES ----------
  static getProfesionalesModel() {
    switch (TYPE) {
      case "MEM":
        return new ProfesionalesMemoryDAO();
      case "FS":
        return new ProfesionalesFsDAO();
      case "MONGO":
      default:
        return ProfesionalModel;
    }
  }

  // ---------- ESPECIALIDADES ----------
  static getEspecialidadesModel() {
    switch (TYPE) {
      case "MEM":
        return new EspecialidadesMemoryDAO();
      case "FS":
        return new EspecialidadesFsDAO();
      case "MONGO":
      default:
        return EspecialidadModel;
    }
  }

  // ---------- PRESTACIONES ----------
  static getPrestacionesModel() {
    switch (TYPE) {
      case "MEM":
        return new PrestacionesMemoryDAO();
      case "FS":
        return new PrestacionesFsDAO();
      case "MONGO":
      default:
        return PrestacionModel;
    }
  }

  // ---------- AGENDAS ----------
  static getAgendasModel() {
    switch (TYPE) {
      case "MEM":
        return new AgendasMemoryDAO();
      case "FS":
        return new AgendasFsDAO();
      case "MONGO":
      default:
        return AgendaModel;
    }
  }

  // ---------- TURNOS ----------
  static getTurnosModel() {
    switch (TYPE) {
      case "MEM":
        return new TurnosMemoryDAO();
      case "FS":
        return new TurnosFsDAO();
      case "MONGO":
      default:
        return TurnoModel;
    }
  }
}

export default DaoFactory;
