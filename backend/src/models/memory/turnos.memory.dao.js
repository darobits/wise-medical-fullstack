import BaseDAO from "../DAO/BaseDAO.js";
import { randomUUID } from "crypto";

class TurnosMemoryDAO extends BaseDAO {
  constructor() {
    super();
    this.items = [];
  }

  async create(data) {
    const item = { _id: randomUUID(), ...data };
    this.items.push(item);
    return item;
  }

  async find(filter = {}) {
    return this.findAll(filter);
  }

  async findAll(filter = {}) {
    return this.items.filter((t) => {
      let ok = true;
      if (filter.agendaId)
        ok = ok && String(t.agendaId) === String(filter.agendaId);
      if (filter.fecha) ok = ok && t.fecha === filter.fecha;
      if (filter.estado) ok = ok && t.estado === filter.estado;
      return ok;
    });
  }

  async findById(id) {
    return this.items.find((t) => t._id === id) || null;
  }

  async findByIdAndUpdate(id, data, opts = {}) {
    const idx = this.items.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...data };
    return opts.new ? this.items[idx] : null;
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    const deleted = this.items[idx];
    this.items.splice(idx, 1);
    return deleted;
  }
}

export default TurnosMemoryDAO;
