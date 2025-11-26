// test/integration/auth.integration.test.js
import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcrypt";

import app from "../../index.js";
import { connectDB } from "../../src/config/MongoDBConnection.js";
import { UsuarioModel } from "../../src/models/mongo/usuario.model.js";

const ADMIN_EMAIL = "admin-test@tp2.com";
const ADMIN_PASS = "admin123";

async function seedAdminTest() {
  await connectDB();

  // Eliminamos si ya existiera
  await UsuarioModel.deleteOne({ email: ADMIN_EMAIL });

  const passwordHash = await bcrypt.hash(ADMIN_PASS, 10);

  await UsuarioModel.create({
    nombre: "Admin Test",
    email: ADMIN_EMAIL,
    passwordHash,
    rol: "ADMIN"
  });
}

describe("Auth - Tests de integración", () => {
  before(async () => {
    await seedAdminTest();
  });

  it("POST /api/auth/login debe loguear al admin y devolver un token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: ADMIN_EMAIL,
        password: ADMIN_PASS
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("POST /api/auth/login con credenciales inválidas debe fallar", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: ADMIN_EMAIL,
        password: "password_incorrecto"
      });

    expect(res.status).to.not.equal(200);
  });
});
