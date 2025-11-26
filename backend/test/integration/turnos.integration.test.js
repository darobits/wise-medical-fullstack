// test/integration/turnos.integration.test.js

import { expect } from "chai";
import request from "supertest";
import bcrypt from "bcrypt";

import app from "../../index.js";
import { connectDB } from "../../src/config/MongoDBConnection.js";

// Modelos de Mongo
import { UsuarioModel } from "../../src/models/mongo/usuario.model.js";
import { EspecialidadModel } from "../../src/models/mongo/especialidad.model.js";
import { PrestacionModel } from "../../src/models/mongo/prestacion.model.js";
import { ProfesionalModel } from "../../src/models/mongo/profesional.model.js";
import { AgendaModel } from "../../src/models/mongo/agenda.model.js";

const ADMIN_EMAIL = "admin-test@tp2.com";
const ADMIN_PASS = "admin123";

describe("Turnos - Tests de integración", () => {
  let tokenAdmin;
  let agendaId;

  before(async () => {
    await connectDB();

    await Promise.all([
      UsuarioModel.deleteMany({ email: ADMIN_EMAIL }),
      EspecialidadModel.deleteMany({}),
      PrestacionModel.deleteMany({}),
      ProfesionalModel.deleteMany({}),
      AgendaModel.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash(ADMIN_PASS, 10);
    await UsuarioModel.create({
      nombre: "Admin Test Turnos",
      email: ADMIN_EMAIL,
      passwordHash,
      rol: "ADMIN"
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASS });

    expect(login.status).to.equal(200);
    tokenAdmin = login.body.token;

    // Creamos datos base
    const especialidad = await EspecialidadModel.create({
      nombre: `Clínica Médica Test ${Date.now()}`,
      activa: true
    });

    const prestacion = await PrestacionModel.create({
      nombre: `CONSULTA CLÍNICA TEST ${Date.now()}`,
      especialidadId: especialidad._id,
      activa: true
    });

    const profesional = await ProfesionalModel.create({
      nombreCompleto: `Dra. Clínica Test ${Date.now()}`,
      matricula: `CLIN-${Date.now()}`,
      especialidadId: especialidad._id,
      activo: true
    });

    const agenda = await AgendaModel.create({
      nombre: `Agenda Clínica Tarde Test ${Date.now()}`,
      profesionalId: profesional._id,
      especialidadId: especialidad._id,
      prestacionesIds: [prestacion._id],
      prestacionPrincipalId: prestacion._id,
      diasSemana: ["LUN", "MAR", "MIE", "JUE", "VIE"],
      horaInicio: "14:00",
      horaFin: "18:00",
      duracionMinutos: 30,
      limiteProspectivoDias: 15,
      activa: true
    });

    agendaId = agenda._id.toString();
  });

  it("GET /api/turnos/slots/:agendaId debe devolver slots disponibles", async () => {
    const res = await request(app)
      .get(`/api/turnos/slots/${agendaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("slots");
    expect(res.body.slots).to.be.an("array");
  });

  it("POST /api/turnos debe crear un turno para un paciente", async () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fecha = `${yyyy}-${mm}-${dd}`;

    const res = await request(app)
      .post("/api/turnos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        agendaId,
        fecha,
        hora: "14:00",
        pacienteNombre: "Paciente Test",
        pacienteDocumento: "12345678",
        prestacionesExtraIds: []
      });

    expect(res.status).to.be.oneOf([200, 201]);

    // ✔️ El service devuelve { id, fecha, hora, agenda, ... }
    expect(res.body).to.have.property("id");
    expect(res.body).to.have.property("fecha", fecha);
    expect(res.body).to.have.property("hora", "14:00");

    // ✔️ Agenda anidada
    expect(res.body.agenda).to.have.property("id");
  });
});
