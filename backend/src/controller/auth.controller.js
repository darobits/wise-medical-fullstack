import authService from "../services/auth.service.js";

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
