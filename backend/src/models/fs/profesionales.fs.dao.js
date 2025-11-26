import BaseDAO from "../DAO/BaseDAO.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../../../data/profesionales.json");

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, "[]", "utf-8");
  }
}

async function readAll() {
  await ensureFile();
  const content = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(content || "[]");
}

async function writeAll(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

class ProfesionalesFsDAO extends BaseDAO {
  async create(data) {
    const items = await readAll();
    const item = { _id: randomUUID(), ...data };
    items.push(item);
    await writeAll(items);
    return item;
  }

  async find(filter = {}) {
    return this.findAll(filter);
  }

  async findAll(filter = {}) {
    const items = await readAll();
    return items.filter((p) => {
      let ok = true;
      if (filter.especialidadId)
        ok = ok && String(p.especialidadId) === String(filter.especialidadId);
      if (filter.activo !== undefined)
        ok = ok && p.activo === filter.activo;
      return ok;
    });
  }

  async findOne(filter = {}) {
    const all = await this.findAll(filter);
    return all[0] || null;
  }

  async findById(id) {
    const items = await readAll();
    return items.find((p) => p._id === id) || null;
  }

  async findByIdAndUpdate(id, data, opts = {}) {
    const items = await readAll();
    const idx = items.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    await writeAll(items);
    return opts.new ? items[idx] : null;
  }

  async findByIdAndDelete(id) {
    const items = await readAll();
    const idx = items.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    const deleted = items[idx];
    items.splice(idx, 1);
    await writeAll(items);
    return deleted;
  }
}

export default ProfesionalesFsDAO;
