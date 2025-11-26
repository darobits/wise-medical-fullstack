// Interfaz base para que todos los DAOs tengan la misma forma
class BaseDAO {
  async create(data) {
    throw new Error("create() not implemented");
  }

  async findAll(filter = {}) {
    throw new Error("findAll() not implemented");
  }

  async findById(id) {
    throw new Error("findById() not implemented");
  }

  async update(id, data) {
    throw new Error("update() not implemented");
  }

  async delete(id) {
    throw new Error("delete() not implemented");
  }
}

export default BaseDAO;
