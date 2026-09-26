// Calendar helpers shared by streaks and recurrence. Everything here works in
// the server's local time zone, because "a day" means the user's day.

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function dayKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDayKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Whole calendar days from a to b (negative if b is earlier).
export function daysBetween(a, b) {
  return Math.floor((startOfDay(b) - startOfDay(a)) / 86400000);
}

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function addMonths(d, n) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
