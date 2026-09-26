// Habit streaks for the time-management screen.
import { dayKey, daysBetween, parseDayKey } from "./dates.js";

// Distinct local days that have at least one entry, oldest first.
export function activeDays(entries) {
  const keys = new Set(entries.map((e) => dayKey(new Date(e.createdAt))));
  return [...keys].sort().map(parseDayKey);
}

// Consecutive days ending today. A streak is still alive if the last entry
// was yesterday (the user has until midnight to keep it going).
export function currentStreak(entries, now = new Date()) {
  const days = activeDays(entries).reverse();
  if (days.length === 0) return 0;
  if (daysBetween(days[0], now) > 1) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (daysBetween(days[i], days[i - 1]) !== 1) break;
    streak++;
  }
  return streak;
}

export function longestStreak(entries) {
  const days = activeDays(entries);
  let best = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && daysBetween(days[i - 1], days[i]) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}
