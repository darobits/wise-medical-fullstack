// test/integration/users.integration.test.js
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
  await UsuarioModel.deleteOne({ email: ADMIN_EMAIL });
  const passwordHash = await bcrypt.hash(ADMIN_PASS, 10);
  await UsuarioModel.create({
    nombre: "Admin Test",
    email: ADMIN_EMAIL,
    passwordHash,
    rol: "ADMIN"
  });
}

describe("Users - Tests de integración", () => {
  let tokenAdmin;

  before(async () => {
    await seedAdminTest();

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASS });

    expect(login.status).to.equal(200);
    tokenAdmin = login.body.token;
  });

  it("GET /api/users sin token debe devolver 401 o 403", async () => {
    const res = await request(app).get("/api/users");
    expect([401, 403]).to.include(res.status);
  });

  it("GET /api/users con token de ADMIN debe devolver lista de usuarios", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/users debe crear un usuario nuevo con rol TURNERO", async () => {
    const emailRandom = `turnero_${Date.now()}@test.com`;

    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nombre: "Turnero Test",
        email: emailRandom,
        password: "turnero123",
        rol: "TURNERO"
      });

    expect(res.status).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property("_id");
    expect(res.body).to.have.property("email", emailRandom);
    expect(res.body).to.have.property("rol", "TURNERO");
  });
});
