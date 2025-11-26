// src/services/agendas.rules.js

// fechaTurno y fechaBase son objetos Date
export function estaDentroDelLimiteProspectivo(fechaTurno, fechaBase, limiteDias) {
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

// agenda.diasSemana = ["LUN","MAR",...]
// fecha es un Date
export function esDiaHabilParaAgenda(agenda, fecha) {
  if (!agenda || !Array.isArray(agenda.diasSemana)) return false;

  const mapaDias = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const dia = mapaDias[fecha.getDay()]; // 0..6

  return agenda.diasSemana.includes(dia);
}
