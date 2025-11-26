import BaseDAO from "../DAO/BaseDAO.js";
import { randomUUID } from "crypto";

class UsersMemoryDAO extends BaseDAO {
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
    return this.items.filter((u) => {
      let ok = true;
      if (filter.email) ok = ok && u.email === filter.email;
      if (filter.rol) ok = ok && u.rol === filter.rol;
      return ok;
    });
  }

  async findOne(filter = {}) {
    const all = await this.findAll(filter);
    return all[0] || null;
  }

  async findById(id) {
    return this.items.find((u) => u._id === id) || null;
  }

  async findByIdAndUpdate(id, data, opts = {}) {
    const idx = this.items.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    this.items[idx] = { ...this.items[idx], ...data };
    return opts.new ? this.items[idx] : null;
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    const deleted = this.items[idx];
    this.items.splice(idx, 1);
    return deleted;
  }
}

export default UsersMemoryDAO;
