import bcrypt from "bcrypt";
import { UsuarioModel } from "../models/mongo/usuario.model.js";

class UsersService {
  async crearUsuario(data) {
    const existe = await UsuarioModel.findOne({ email: data.email });
    if (existe) {
      const err = new Error("El email ya está registrado");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await UsuarioModel.create({
      nombre: data.nombre,
      email: data.email,
      passwordHash,
      rol: data.rol || "TURNERO"
    });

    // ocultamos el hash al devolver
    const obj = user.toObject();
    delete obj.passwordHash;
    return obj;
  }

  async listarUsuarios() {
    const usuarios = await UsuarioModel.find().select("-passwordHash");
    return usuarios;
  }

  async buscarPorEmail(email) {
    return await UsuarioModel.findOne({ email });
  }
}

export default new UsersService();


/**si usamos la daofactory probar si no rompe:
 * 
 * import bcrypt from "bcrypt";
import DaoFactory from "../models/DAO/DaoFactory.js";

const UsuarioDAO = DaoFactory.getUsuariosModel();

class UsersService {
  async crearUsuario(data) {
    const existe =
      typeof UsuarioDAO.findOne === "function"
        ? await UsuarioDAO.findOne({ email: data.email })
        : await UsuarioDAO.findAll({ email: data.email }).then(r => r[0]);

    if (existe) {
      const err = new Error("El email ya está registrado");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await UsuarioDAO.create({
      nombre: data.nombre,
      email: data.email,
      passwordHash,
      rol: data.rol || "TURNERO"
    });

    const obj =
      typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete obj.passwordHash;

    return obj;
  }

  async listarUsuarios() {
    const usuarios = await UsuarioDAO.find({});
    return usuarios.map(u => {
      const obj = typeof u.toObject === "function" ? u.toObject() : { ...u };
      delete obj.passwordHash;
      return obj;
    });
  }

  async buscarPorEmail(email) {
    if (typeof UsuarioDAO.findOne === "function") {
      return await UsuarioDAO.findOne({ email });
    }
    const all = await UsuarioDAO.findAll({ email });
    return all[0] || null;
  }
}

export default new UsersService();

 */