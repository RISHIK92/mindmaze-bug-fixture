import test from "node:test";
import assert from "node:assert/strict";
import { projectBreakdown, taskCompletionRate } from "../src/lib/dashboardStats.js";

const p = (progress) => ({ progress });

test("every project lands in exactly one bucket", () => {
  const projects = [0, 10, 30, 49, 50, 89, 90, 100].map(p);
  const b = projectBreakdown(projects);
  assert.equal(b.onTrack + b.atRisk + b.delayed + b.completed, b.total);
});

test("finished projects are reported as completed", () => {
  const b = projectBreakdown([p(90), p(100), p(60)]);
  assert.equal(b.completed, 2);
  assert.equal(b.onTrack, 1);
});

test("bucket boundaries", () => {
  assert.deepEqual(
    projectBreakdown([p(24), p(25), p(49), p(50)]),
    { total: 4, onTrack: 1, atRisk: 2, delayed: 1, completed: 0 }
  );
});

test("task completion rate", () => {
  assert.equal(taskCompletionRate([]), 0);
  assert.equal(taskCompletionRate([{ status: true }, { status: false }]), 50);
});
