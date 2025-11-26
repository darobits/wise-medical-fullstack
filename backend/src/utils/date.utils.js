// Convierte "YYYY-MM-DD" a Date (sin hora)
export const parseDate = (str) => {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Convierte Date a "YYYY-MM-DD"
export const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Devuelve código de día "LUN", "MAR", etc.
export const getDiaSemanaCode = (date) => {
  const dia = date.getDay(); // 0 = DOM, 1 = LUN, ...
  const map = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  return map[dia];
};

// Suma minutos a un string "HH:mm" → devuelve "HH:mm"
export const addMinutesToTime = (horaStr, minutos) => {
  const [h, m] = horaStr.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m, 0); // fecha dummy
  date.setMinutes(date.getMinutes() + minutos);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

// Compara hora "HH:mm" <= "HH:mm"
export const isTimeLessOrEqual = (horaA, horaB) => {
  const [h1, m1] = horaA.split(":").map(Number);
  const [h2, m2] = horaB.split(":").map(Number);
  if (h1 < h2) return true;
  if (h1 > h2) return false;
  return m1 <= m2;
};
