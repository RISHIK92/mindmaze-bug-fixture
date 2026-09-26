process.env.TZ = "Asia/Kolkata"; // UTC+5:30: local midnight is still "yesterday" in UTC
import test from "node:test";
import assert from "node:assert/strict";
import { expand } from "../src/lib/recurrence.js";
import { addMonths } from "../src/lib/dates.js";

test("daily and weekly rules", () => {
  assert.deepEqual(
    expand({ anchor: "2026-03-01", freq: "daily", interval: 2 }, "2026-03-01", "2026-03-07"),
    ["2026-03-01", "2026-03-03", "2026-03-05", "2026-03-07"]
  );
  assert.deepEqual(
    expand({ anchor: "2026-03-02", freq: "weekly" }, "2026-03-01", "2026-03-31"),
    ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30"]
  );
});

test("monthly on the 15th", () => {
  assert.deepEqual(
    expand({ anchor: "2026-01-15", freq: "monthly" }, "2026-01-01", "2026-04-30"),
    ["2026-01-15", "2026-02-15", "2026-03-15", "2026-04-15"]
  );
});

test("window can start after the anchor", () => {
  assert.deepEqual(
    expand({ anchor: "2026-01-15", freq: "monthly" }, "2026-03-01", "2026-04-30"),
    ["2026-03-15", "2026-04-15"]
  );
});

test("until is inclusive", () => {
  assert.deepEqual(
    expand({ anchor: "2026-03-01", freq: "daily", until: "2026-03-03" }, "2026-03-01", "2026-03-31"),
    ["2026-03-01", "2026-03-02", "2026-03-03"]
  );
});

test("month-end rules clamp to the last day and never drift", () => {
  assert.deepEqual(
    expand({ anchor: "2026-01-31", freq: "monthly" }, "2026-01-01", "2026-06-30"),
    ["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30", "2026-05-31", "2026-06-30"]
  );
});

test("leap day anchors", () => {
  assert.deepEqual(
    expand({ anchor: "2024-02-29", freq: "monthly", interval: 12 }, "2024-01-01", "2028-12-31"),
    ["2024-02-29", "2025-02-28", "2026-02-28", "2027-02-28", "2028-02-29"]
  );
});

test("exdates hide exactly that occurrence", () => {
  assert.deepEqual(
    expand(
      { anchor: "2026-01-31", freq: "monthly", exdates: ["2026-03-31"] },
      "2026-01-01",
      "2026-04-30"
    ),
    ["2026-01-31", "2026-02-28", "2026-04-30"]
  );
});

test("count is counted from the anchor, not from the window", () => {
  const rule = { anchor: "2026-01-10", freq: "weekly", count: 4 }; // 1/10 1/17 1/24 1/31
  assert.deepEqual(expand(rule, "2026-01-20", "2026-12-31"), ["2026-01-24", "2026-01-31"]);
});

test("an excluded date still uses up one of the count", () => {
  const rule = { anchor: "2026-01-10", freq: "weekly", count: 3, exdates: ["2026-01-17"] };
  assert.deepEqual(expand(rule, "2026-01-01", "2026-12-31"), ["2026-01-10", "2026-01-24"]);
});

test("addMonths clamps", () => {
  assert.equal(addMonths(new Date(2026, 0, 31), 1).getDate(), 28);
  assert.equal(addMonths(new Date(2026, 0, 31), 2).getDate(), 31);
  assert.equal(addMonths(new Date(2026, 4, 31), -1).getDate(), 30);
});
