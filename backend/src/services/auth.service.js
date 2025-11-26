import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersService from "./users.service.js";
import config from "../config/config.js";

class AuthService {
  async login(email, password) {
    const user = await usersService.buscarPorEmail(email);
    if (!user) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const payload = {
      id: user._id,
      rol: user.rol,
      nombre: user.nombre
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "8h"
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return { token, user: userObj };
  }
}

export default new AuthService();
