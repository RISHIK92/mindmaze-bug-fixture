process.env.TZ = "America/New_York"; // DST starts 2026-03-08, a 23-hour day
import test from "node:test";
import assert from "node:assert/strict";
import { currentStreak, longestStreak } from "../src/lib/streaks.js";

const at = (y, m, d, h = 12) => ({ createdAt: new Date(y, m - 1, d, h) });

test("no entries, no streak", () => {
  assert.equal(currentStreak([], new Date(2026, 5, 1)), 0);
  assert.equal(longestStreak([]), 0);
});

test("several entries on one day count once", () => {
  const e = [at(2026, 6, 1, 8), at(2026, 6, 1, 20), at(2026, 5, 31)];
  assert.equal(currentStreak(e, new Date(2026, 5, 1, 21)), 2);
});

test("streak survives until the end of the next day", () => {
  const e = [at(2026, 6, 1), at(2026, 6, 2)];
  assert.equal(currentStreak(e, new Date(2026, 5, 3, 23, 30)), 2);
  assert.equal(currentStreak(e, new Date(2026, 5, 4, 0, 30)), 0);
});

test("a gap ends the streak", () => {
  const e = [at(2026, 6, 1), at(2026, 6, 2), at(2026, 6, 4), at(2026, 6, 5)];
  assert.equal(currentStreak(e, new Date(2026, 5, 5, 9)), 2);
  assert.equal(longestStreak(e), 2);
});

test("streak runs straight through the spring-forward day", () => {
  const e = [6, 7, 8, 9, 10].map((d) => at(2026, 3, d));
  assert.equal(currentStreak(e, new Date(2026, 2, 10, 18)), 5);
  assert.equal(longestStreak(e), 5);
});

test("streak runs through the fall-back day", () => {
  const e = [31, 1, 2, 3].map((d, i) => (i === 0 ? at(2026, 10, d) : at(2026, 11, d)));
  assert.equal(longestStreak(e), 4);
});
