import { supabase } from "@/lib/supabase";
import { FlowId, MOODS, MoodId, addDays, fromDateKey, toDateKey } from "@/lib/journal";

// Insights only needs the tags, never what people wrote
export interface InsightEntry {
  entry_date: string;
  mood: MoodId | null;
  flow: FlowId | null;
  symptoms: string[];
}

// How far back Insights looks (also limits the month switcher)
export const HISTORY_MONTHS = 12;

export async function fetchInsightEntries(): Promise<InsightEntry[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - (HISTORY_MONTHS - 1), 1);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("entry_date, mood, flow, symptoms")
    .gte("entry_date", toDateKey(since))
    .order("entry_date");

  if (error) throw error;
  return data ?? [];
}

export function inMonth(entries: InsightEntry[], month: string) {
  return entries.filter((e) => e.entry_date.startsWith(month));
}

export function daysBetween(from: string, to: string) {
  // Rounding absorbs the hour lost or gained at daylight saving changes
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / 86_400_000);
}

// Pages and streaks 

export function streaks(entries: InsightEntry[], today: string) {
  const days = new Set(entries.map((e) => e.entry_date));

  // Current streak counts back from today. If today isn't written yet,
  // the streak is still alive, so start from yesterday.
  let current = 0;
  let day = days.has(today) ? today : addDays(today, -1);
  while (days.has(day)) {
    current++;
    day = addDays(day, -1);
  }

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of [...days].sort()) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest };
}

// Symptoms 

export function symptomCounts(entries: InsightEntry[]) {
  const counts = new Map<string, number>();
  for (const e of entries) {
    for (const s of e.symptoms) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts]
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count);
}

// Mood over time 

export const MOOD_SCORE: Record<MoodId, number> = { rough: 1, low: 2, okay: 3, good: 4, great: 5 };

// MOODS is ordered great to rough, so score 5 is index 0
export function moodForScore(score: number) {
  return MOODS[5 - Math.round(score)];
}

// Each of the last `weeks` weeks (Sunday to Saturday): the average mood,
// plus the lowest and highest, so a week of ups and downs doesn't hide
// behind a middle-of-the-road average
export function weeklyMood(entries: InsightEntry[], today: string, weeks = 8) {
  const thisWeek = addDays(today, -fromDateKey(today).getDay());

  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(thisWeek, -7 * (weeks - 1 - i));
    const end = addDays(start, 6);
    const scores = entries
      .filter((e) => e.mood && e.entry_date >= start && e.entry_date <= end)
      .map((e) => MOOD_SCORE[e.mood!]);

    return {
      start,
      average: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
      low: scores.length ? Math.min(...scores) : null,
      high: scores.length ? Math.max(...scores) : null,
    };
  });
}

// How many days of each mood since `from` (for the plain facts under the chart)
export function moodCounts(entries: InsightEntry[], from: string) {
  return MOODS.map((m) => ({
    ...m,
    count: entries.filter((e) => e.mood === m.id && e.entry_date >= from).length,
  })).filter((m) => m.count > 0);
}

// One honest sentence about the last few weeks. It looks at how much
// moods moved day to day (not just the weekly averages, which can hide
// a mix of very good and very hard days) and at the recent direction.
export function moodSummary(entries: InsightEntry[], from: string) {
  const days = entries.filter((e) => e.mood && e.entry_date >= from);
  if (days.length < 7) return null; // too little to say anything fair

  const scores = days.map((e) => MOOD_SCORE[e.mood!]);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const spread = Math.sqrt(scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length);

  // Direction: the most recent two weeks against everything before them
  const recentFrom = addDays(days[days.length - 1].entry_date, -13);
  const avg = (list: number[]) => list.reduce((a, b) => a + b, 0) / list.length;
  const recent = days.filter((e) => e.entry_date >= recentFrom).map((e) => MOOD_SCORE[e.mood!]);
  const earlier = days.filter((e) => e.entry_date < recentFrom).map((e) => MOOD_SCORE[e.mood!]);
  const change = recent.length && earlier.length ? avg(recent) - avg(earlier) : 0;

  const shape =
    spread >= 1.1
      ? "Your moods have moved around a lot, with both good days and hard ones."
      : spread >= 0.7
        ? "Your moods have had some ups and downs."
        : "Your moods have been fairly steady.";

  const direction =
    change > 0.5
      ? " The last couple of weeks have been lighter."
      : change < -0.5
        ? " The last couple of weeks have been heavier. Be gentle with yourself."
        : "";

  return shape + direction;
}

// Cycles 

const BLEEDING: FlowId[] = ["light", "medium", "heavy"];

// Groups bleeding days into periods (a gap of more than 10 days starts a
// new one). Each period knows when it started, how long it lasted, and,
// if another period came after it, how long that whole cycle was.
// Works from whatever was logged: no daily logging or streak needed.
export function periodHistory(entries: InsightEntry[]) {
  const bleedingDays = entries
    .filter((e) => e.flow && BLEEDING.includes(e.flow))
    .map((e) => e.entry_date)
    .sort();

  const periods: { start: string; end: string }[] = [];
  for (const day of bleedingDays) {
    const last = periods[periods.length - 1];
    if (last && daysBetween(last.end, day) <= 10) last.end = day;
    else periods.push({ start: day, end: day });
  }

  return periods.map((p, i) => ({
    start: p.start,
    periodDays: daysBetween(p.start, p.end) + 1,
    cycleLength: periods[i + 1] ? daysBetween(p.start, periods[i + 1].start) : null,
  }));
}

export function cycleSummary(entries: InsightEntry[], today: string) {
  const periods = periodHistory(entries).slice(-6);
  const cycles = periods.filter((p) => p.cycleLength !== null).map((p) => p.cycleLength!);
  const average = (list: number[]) =>
    list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null;
  const last = periods[periods.length - 1];

  return {
    periods,
    averageCycle: average(cycles),
    averagePeriod: average(periods.map((p) => p.periodDays)),
    currentDay: last ? daysBetween(last.start, today) + 1 : null,
  };
}