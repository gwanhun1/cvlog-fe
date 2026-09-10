export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}
export interface ContributionData {
  total: number;
  days: ContributionDay[];
  fetchedAt: string;
}
export const CONTRIBUTION_COLORS = [
  '#e2e8f0',
  '#60a5fa',
  '#2563eb',
  '#1d4ed8',
  '#172554',
];
const DAY = 86400000;

export function contributionSummary(
  days: ContributionDay[],
  today = new Date().toISOString().slice(0, 10),
) {
  const sorted = [...days]
    .filter(day => day.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0,
    run = 0;
  sorted.forEach((day, i) => {
    const adjacent =
      !i || Date.parse(day.date) - Date.parse(sorted[i - 1].date) === DAY;
    run = day.count > 0 ? (adjacent ? run + 1 : 1) : 0;
    longest = Math.max(longest, run);
  });
  const byDate = new Map(sorted.map(day => [day.date, day.count]));
  let current = 0,
    cursor = Date.parse(today);
  if (!byDate.get(today)) cursor -= DAY;
  while (byDate.get(new Date(cursor).toISOString().slice(0, 10))) {
    current++;
    cursor -= DAY;
  }
  const months = new Map<string, number>();
  sorted.forEach(day => {
    const month = day.date.slice(0, 7);
    months.set(month, (months.get(month) || 0) + day.count);
  });
  return {
    total: sorted.reduce((sum, day) => sum + day.count, 0),
    active: sorted.filter(day => day.count > 0).length,
    longest,
    current,
    best: [...sorted].sort((a, b) => b.count - a.count)[0],
    months: [...months].map(([month, count]) => ({ month, count })),
  };
}

// GitHub's public calendar HTML: match cells and tooltips by id, never attribute order.
export function parseContributions(html: string): ContributionDay[] {
  const tooltips = new Map<string, string>();
  for (const match of html.matchAll(
    /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g,
  )) {
    const id = /\bfor="([^"]+)"/.exec(match[1])?.[1];
    if (id) tooltips.set(id, match[2].replace(/<[^>]*>/g, '').trim());
  }
  const days = new Map<string, ContributionDay>();
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(match[1])?.[1];
    if (!date) continue;
    const level = /\bdata-level="([0-4])"/.exec(match[1])?.[1];
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1];
    const tooltip = id ? tooltips.get(id) : undefined;
    const count = tooltip?.match(/^(No|[\d,]+) contributions?\b/i)?.[1];
    if (level === undefined || count === undefined)
      throw new Error('Incomplete GitHub contribution data');
    const value =
      count.toLowerCase() === 'no' ? 0 : Number(count.replace(/,/g, ''));
    if (!Number.isSafeInteger(value) || value < 0)
      throw new Error('Invalid contribution count');
    days.set(date, { date, level: Number(level), count: value });
  }
  if (!days.size) throw new Error('Contribution graph unavailable');
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}
