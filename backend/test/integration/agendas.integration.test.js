// test/unit/agendas.rules.test.js
import { expect } from "chai";
import {
  estaDentroDelLimiteProspectivo,
  esDiaHabilParaAgenda
} from "../../src/services/agendas.rules.js";

describe("Reglas de Agendas - Tests unitarios", () => {
  describe("estaDentroDelLimiteProspectivo()", () => {
    it("debe devolver true cuando la fecha está dentro del límite", () => {
      const base = new Date(2025, 0, 1);   // 1 enero
      const turno = new Date(2025, 0, 10); // 10 enero
      const resultado = estaDentroDelLimiteProspectivo(turno, base, 15);
      expect(resultado).to.equal(true);
    });

    it("debe devolver false cuando la fecha excede el límite", () => {
      const base = new Date(2025, 0, 1);
      const turno = new Date(2025, 0, 20);
      const resultado = estaDentroDelLimiteProspectivo(turno, base, 10);
      expect(resultado).to.equal(false);
    });
  });

  describe("esDiaHabilParaAgenda()", () => {
    it("debe devolver true si el día está habilitado en la agenda", () => {
      const agenda = { diasSemana: ["LUN", "MAR", "MIE"] };
      const lunes = new Date(2025, 0, 13); // 13/01/2025 es lunes
      const resultado = esDiaHabilParaAgenda(agenda, lunes);
      expect(resultado).to.equal(true);
    });

    it("debe devolver false si el día NO está habilitado en la agenda", () => {
      const agenda = { diasSemana: ["LUN", "MAR", "MIE"] };
      const domingo = new Date(2025, 0, 12); // domingo
      const resultado = esDiaHabilParaAgenda(agenda, domingo);
      expect(resultado).to.equal(false);
    });
  });
});
