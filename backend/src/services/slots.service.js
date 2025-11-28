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

function getDiaSemanaCode(date) {
  const mapaDias = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  return mapaDias[date.getDay()];
}

/**
 * Genera slots para una agenda en una fecha concreta.
 * Ahora soporta:
 *  - agenda.franjas: [{ dia, horaInicio, horaFin }]
 *  - o bien el formato legacy (diasSemana + horaInicio + horaFin)
 */
export function generarSlotsAgenda(agenda, fecha) {
  const dur = Number(agenda.duracionMinutos);
  if (!dur || dur <= 0) return [];

  const fechaStr = fecha.toISOString().slice(0, 10);
  const diaCode = getDiaSemanaCode(fecha);

  let franjasDia = [];

  if (Array.isArray(agenda.franjas) && agenda.franjas.length > 0) {
    franjasDia = agenda.franjas.filter((f) => f.dia === diaCode);
  } else if (
    Array.isArray(agenda.diasSemana) &&
    agenda.diasSemana.includes(diaCode) &&
    agenda.horaInicio &&
    agenda.horaFin
  ) {
    // compatibilidad con modelo viejo
    franjasDia = [
      {
        dia: diaCode,
        horaInicio: agenda.horaInicio,
        horaFin: agenda.horaFin
      }
    ];
  }

  if (franjasDia.length === 0) return [];

  const slots = [];

  for (const franja of franjasDia) {
    const inicio = parseHoraToMinutos(franja.horaInicio);
    const fin = parseHoraToMinutos(franja.horaFin);

    if (isNaN(inicio) || isNaN(fin) || fin <= inicio) continue;

    for (let t = inicio; t + dur <= fin; t += dur) {
      slots.push({
        fecha: fechaStr,
        hora: minutosToHoraStr(t)
      });
    }
  }

  return slots;
}
