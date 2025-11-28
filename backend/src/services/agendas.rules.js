// src/services/agendas.rules.js

// fechaTurno y fechaBase son objetos Date
export function estaDentroDelLimiteProspectivo(
  fechaTurno,
  fechaBase,
  limiteDias
) {
  // pasamos todo a "día cero" sin horas para evitar problemas de zona horaria
  const soloFechaTurno = new Date(
    fechaTurno.getFullYear(),
    fechaTurno.getMonth(),
    fechaTurno.getDate()
  );

  const soloFechaBase = new Date(
    fechaBase.getFullYear(),
    fechaBase.getMonth(),
    fechaBase.getDate()
  );

  const diffMs = soloFechaTurno.getTime() - soloFechaBase.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  return diffDias >= 0 && diffDias <= limiteDias;
}

// agenda puede tener:
// - franjas: [{ dia, horaInicio, horaFin }]
// - o legacy: diasSemana: ["LUN","MAR",...]
export function esDiaHabilParaAgenda(agenda, fecha) {
  if (!agenda) return false;

  const mapaDias = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const dia = mapaDias[fecha.getDay()]; // 0..6

  // ✅ nuevo: si hay franjas, usamos eso
  if (Array.isArray(agenda.franjas) && agenda.franjas.length > 0) {
    return agenda.franjas.some((f) => f.dia === dia);
  }

  // ✅ compatibilidad: si no hay franjas, usamos diasSemana
  if (Array.isArray(agenda.diasSemana) && agenda.diasSemana.length > 0) {
    return agenda.diasSemana.includes(dia);
  }

  return false;
}
