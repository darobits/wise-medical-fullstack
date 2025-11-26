// src/services/slots.service.js

// Convierte "HH:mm" a minutos desde las 00:00
function parseHoraToMinutos(horaStr) {
  const [hh, mm] = horaStr.split(":").map(Number);
  return hh * 60 + mm;
}

// Convierte minutos desde las 00:00 a "HH:mm"
function minutosToHoraStr(mins) {
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Genera slots para una agenda en una fecha dada.
 * Por ahora la fecha no afecta la lógica, pero la dejamos
 * para futuro (por ejemplo, excluir fines de semana).
 */
export function generarSlotsAgenda(agenda, fecha) {
  const dur = Number(agenda.duracionMinutos);

  if (!dur || dur <= 0) return [];

  const inicio = parseHoraToMinutos(agenda.horaInicio);
  const fin = parseHoraToMinutos(agenda.horaFin);

  if (isNaN(inicio) || isNaN(fin) || fin <= inicio) return [];

  const slots = [];

  for (let t = inicio; t + dur <= fin; t += dur) {
    slots.push({
      fecha: fecha.toISOString().slice(0, 10), // YYYY-MM-DD por si lo querés usar
      hora: minutosToHoraStr(t)
    });
  }

  return slots;
}
