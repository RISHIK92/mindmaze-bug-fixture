// Pure helpers behind GET /dashboard, kept free of Prisma/Firebase so they can be tested.

export function projectBreakdown(projects) {
  const onTrack = projects.filter((p) => p.progress >= 50 && p.progress < 90).length;
  const atRisk = projects.filter((p) => p.progress >= 25 && p.progress < 50).length;
  const delayed = projects.filter((p) => p.progress < 25).length;
  return { total: projects.length, onTrack, atRisk, delayed };
}

export function taskCompletionRate(todos) {
  if (todos.length === 0) return "No data";
  return Math.round((todos.filter((t) => t.status).length / todos.length) * 100);
}
