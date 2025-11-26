import usersService from "../services/users.service.js";

class UsersController {
  async crearUsuario(req, res, next) {
    try {
      const user = await usersService.crearUsuario(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async listarUsuarios(req, res, next) {
    try {
      const usuarios = await usersService.listarUsuarios();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();
