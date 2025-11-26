// test/unit/slots.service.test.js
import { expect } from "chai";

import { generarSlotsAgenda } from "../../src/services/slots.service.js";

describe("Slots Service - Tests unitarios", () => {
  it("debe generar slots de 30 minutos entre horaInicio y horaFin", () => {
    const agenda = {
      horaInicio: "08:00",
      horaFin: "10:00",
      duracionMinutos: 30
    };

    const fecha = new Date("2025-01-06"); // lunes
    const slots = generarSlotsAgenda(agenda, fecha);

    // Esperamos: 08:00, 08:30, 09:00, 09:30
    expect(slots).to.be.an("array");
    expect(slots.length).to.equal(4);
    expect(slots[0]).to.have.property("hora", "08:00");
    expect(slots[slots.length - 1]).to.have.property("hora", "09:30");
  });

  it("no debe generar slots si duracionMinutos es inválido", () => {
    const agenda = {
      horaInicio: "08:00",
      horaFin: "10:00",
      duracionMinutos: 0
    };

    const fecha = new Date("2025-01-06");
    const slots = generarSlotsAgenda(agenda, fecha);

    expect(slots).to.be.an("array");
    expect(slots.length).to.equal(0);
  });
});
