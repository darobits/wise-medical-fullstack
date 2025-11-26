// test/unit/agendas.rules.test.js
import { expect } from "chai";

import {
  estaDentroDelLimiteProspectivo,
  esDiaHabilParaAgenda
} from "../../src/services/agendas.rules.js";

describe("Reglas de Agendas - Tests unitarios", () => {
  describe("estaDentroDelLimiteProspectivo()", () => {
    it("debe devolver true cuando la fecha está dentro del límite", () => {
      const hoy = new Date();
      const fechaDentro = new Date(hoy);
      fechaDentro.setDate(hoy.getDate() + 10);

      const dentro = estaDentroDelLimiteProspectivo(
        fechaDentro,
        hoy,
        30 // límite 30 días
      );

      expect(dentro).to.equal(true);
    });

    it("debe devolver false cuando la fecha excede el límite", () => {
      const hoy = new Date();
      const fechaFuera = new Date(hoy);
      fechaFuera.setDate(hoy.getDate() + 40);

      const dentro = estaDentroDelLimiteProspectivo(
        fechaFuera,
        hoy,
        30
      );

      expect(dentro).to.equal(false);
    });
  });

  describe("esDiaHabilParaAgenda()", () => {
    const agenda = {
      diasSemana: ["LUN", "MAR", "MIE"]
    };

    it("debe devolver true si el día está habilitado en la agenda", () => {
      // 6/1/2025 es lunes
      const lunes = new Date(2025, 0, 6); // 👈 importante usar (año, mesIndex, día)
      const ok = esDiaHabilParaAgenda(agenda, lunes);
      expect(ok).to.equal(true);
    });

    it("debe devolver false si el día NO está habilitado en la agenda", () => {
      // 5/1/2025 es domingo
      const domingo = new Date(2025, 0, 5); // mismo criterio que arriba
      const ok = esDiaHabilParaAgenda(agenda, domingo);
      expect(ok).to.equal(false);
    });
  });
});
