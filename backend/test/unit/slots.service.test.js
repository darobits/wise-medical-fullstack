// test/unit/slots.service.test.js
import { expect } from "chai";
import { generarSlotsAgenda } from "../../src/services/slots.service.js";

describe("Slots Service - Tests unitarios", () => {
  it("debe generar slots de 30 minutos entre horaInicio y horaFin en una franja", () => {
    const agenda = {
      duracionMinutos: 30,
      franjas: [
        {
          dia: "LUN",
          horaInicio: "08:00",
          horaFin: "10:00"
        }
      ]
    };

    // ✅ fecha creada en horario local
    const fecha = new Date(2025, 0, 6); // lunes
    const slots = generarSlotsAgenda(agenda, fecha);

    expect(slots).to.be.an("array");
    expect(slots.length).to.equal(4);
    expect(slots[0].hora).to.equal("08:00");
    expect(slots[3].hora).to.equal("09:30");
  });

  it("debe generar 0 slots si no hay franja para ese día", () => {
    const agenda = {
      duracionMinutos: 30,
      franjas: [
        {
          dia: "MAR",
          horaInicio: "08:00",
          horaFin: "10:00"
        }
      ]
    };

    const fecha = new Date(2025, 0, 6); // lunes
    const slots = generarSlotsAgenda(agenda, fecha);

    expect(slots).to.be.an("array");
    expect(slots.length).to.equal(0);
  });

  it("no debe generar slots si duracionMinutos es inválido", () => {
    const agenda = {
      duracionMinutos: 0,
      franjas: [
        {
          dia: "LUN",
          horaInicio: "08:00",
          horaFin: "10:00"
        }
      ]
    };

    const fecha = new Date(2025, 0, 6);
    const slots = generarSlotsAgenda(agenda, fecha);

    expect(slots).to.be.an("array");
    expect(slots.length).to.equal(0);
  });
});
