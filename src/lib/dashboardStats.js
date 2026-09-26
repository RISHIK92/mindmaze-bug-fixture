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

/**
 * Generate recurring planner-task occurrences for a range of dates.
 */
export function generateRecurringOccurrences(config, rangeStart, rangeEnd) {
  const occurrences = [];
  const count = config.count || 0;
  let cursor = new Date(config.startDate);
  let generated = 0;

  while (cursor <= rangeEnd && (count === 0 || generated < count)) {
    const dateKey = cursor.toISOString().slice(0, 10);
    if (cursor >= rangeStart && !config.deletedDates.includes(dateKey)) {
      occurrences.push({ date: dateKey, taskId: config.taskId });
    }
    generated += 1;

    if (config.frequency === "monthly") {
      const current = new Date(config.startDate);
      current.setMonth(current.getMonth() + generated);
      const lastDay = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ).getDate();
      cursor = new Date(
        current.getFullYear(),
        current.getMonth(),
        Math.min(config.startDate.getDate(), lastDay)
      );
    } else {
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + (config.interval || 1));
    }
  }

  return occurrences;
}
