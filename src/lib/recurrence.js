// Expands a recurrence rule into concrete planner dates.
//
// rule: { anchor: "YYYY-MM-DD", freq: "daily"|"weekly"|"monthly",
//         interval?: number, count?: number, until?: "YYYY-MM-DD",
//         exdates?: ["YYYY-MM-DD", ...] }
//
// count is the total number of occurrences the series ever has, counted from
// the anchor -- including ones before the requested window and ones removed
// through exdates (same convention as iCalendar). Returns keys within
// [from, to] inclusive, oldest first.
import { addDays, addMonths, dayKey, parseDayKey } from "./dates.js";

function step(rule, d) {
  const n = rule.interval ?? 1;
  if (rule.freq === "daily") return addDays(d, n);
  if (rule.freq === "weekly") return addDays(d, 7 * n);
  if (rule.freq === "monthly") return addMonths(d, n);
  throw new Error(`unknown freq: ${rule.freq}`);
}

export function expand(rule, from, to) {
  const out = [];
  const skip = new Set(rule.exdates ?? []);
  let cur = parseDayKey(rule.anchor);
  let n = 0;

  while (rule.count == null || n < rule.count) {
    const key = dayKey(cur);
    if (key > to || (rule.until && key > rule.until)) break;
    if (key >= from && !skip.has(cur.toISOString().slice(0, 10))) {
      out.push(key);
      n++;
    }
    cur = step(rule, cur);
  }
  return out;
}
