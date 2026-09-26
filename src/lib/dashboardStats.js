// Pure helpers behind GET /dashboard, kept free of Prisma/Firebase so they can be tested.

export function projectBreakdown(projects) {
  const onTrack = projects.filter((p) => p.progress >= 50 && p.progress < 90).length;
  const atRisk = projects.filter((p) => p.progress >= 25 && p.progress < 50).length;
  const delayed = projects.filter((p) => p.progress < 25).length;
  return { total: projects.length, onTrack, atRisk, delayed };
}

export function taskCompletionRate(todos) {
  if (todos.length === 0) return 0;
  return Math.round((todos.filter((t) => t.status).length / todos.length) * 100);
}

export function habitStreak(entries) {
  if (entries.length === 0) return 0;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const days = entries
    .map((entry) => {
      const date = new Date(entry);
      return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    })
    .sort((a, b) => a - b);

  let streak = 1;
  for (let i = 1; i < days.length; i += 1) {
    const dayDifference = days[i] - days[i - 1];
    if (dayDifference === DAY_MS) {
      streak += 1;
    } else if (dayDifference > DAY_MS) {
      streak = 1;
    }
  }

  return streak;
}
