import BaseDAO from "../DAO/BaseDAO.js";
import { randomUUID } from "crypto";

class EspecialidadesMemoryDAO extends BaseDAO {
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
    return this.items.filter((e) => {
      let ok = true;
      if (filter.nombre)
        ok = ok && e.nombre.toLowerCase().includes(filter.nombre.toLowerCase());
      return ok;
    });
  }

  async findById(id) {
    return this.items.find((e) => e._id === id) || null;
  }

  async findByIdAndUpdate(id, data, opts = {}) {
    const idx = this.items.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...data };
    return opts.new ? this.items[idx] : null;
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    const deleted = this.items[idx];
    this.items.splice(idx, 1);
    return deleted;
  }
}

export default EspecialidadesMemoryDAO;
