import BaseDAO from "../DAO/BaseDAO.js";
import { randomUUID } from "crypto";

class AgendasMemoryDAO extends BaseDAO {
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
    return this.items.filter((a) => {
      let ok = true;
      if (filter.profesionalId)
        ok = ok && String(a.profesionalId) === String(filter.profesionalId);
      if (filter.especialidadId)
        ok = ok && String(a.especialidadId) === String(filter.especialidadId);
      return ok;
    });
  }

  async findById(id) {
    return this.items.find((a) => a._id === id) || null;
  }

  async findByIdAndUpdate(id, data, opts = {}) {
    const idx = this.items.findIndex((a) => a._id === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...data };
    return opts.new ? this.items[idx] : null;
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex((a) => a._id === id);
    if (idx === -1) return null;
    const deleted = this.items[idx];
    this.items.splice(idx, 1);
    return deleted;
  }
}

export default AgendasMemoryDAO;
