import { supabase } from "@/lib/supabase";

export const MOODS = [
  { id: "great", label: "Great", dot: "bg-mood-great" },
  { id: "good", label: "Good", dot: "bg-mood-good" },
  { id: "okay", label: "Okay", dot: "bg-mood-okay" },
  { id: "low", label: "Low", dot: "bg-mood-low" },
  { id: "rough", label: "Rough", dot: "bg-mood-rough" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export const SYMPTOMS = [
  "Cramps",
  "Bloating",
  "Acne",
  "Fatigue",
  "Headache",
  "Cravings",
  "Hair changes",
  "Brain fog",
  "Trouble sleeping",
  "Period",
];

export interface JournalEntry {
  id: number;
  entry_date: string; // "2026-10-25"
  content: string;
  mood: MoodId | null;
  symptoms: string[];
}

// What's being edited for the selected day
export interface Draft {
  content: string;
  mood: MoodId | null;
  symptoms: string[];
}

export const EMPTY_DRAFT: Draft = { content: "", mood: null, symptoms: [] };

export function draftFrom(entry?: JournalEntry): Draft {
  return entry
    ? { content: entry.content, mood: entry.mood, symptoms: entry.symptoms }
    : EMPTY_DRAFT;
}

export function isEmptyDraft(d: Draft) {
  return !d.content.trim() && !d.mood && d.symptoms.length === 0;
}

export function moodById(id: MoodId | null) {
  return MOODS.find((m) => m.id === id);
}

// Dates 
// Days are stored as "YYYY-MM-DD" in the user's own timezone.
// (Never use toISOString() for this: it converts to UTC, so late-evening
// entries in Toronto would land on the next day.)

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function monthKey(key: string) {
  return key.slice(0, 7); // "2026-10"
}

export function formatLongDate(key: string) {
  return fromDateKey(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Supabase 
// Row level security means these only ever return or change the
// signed-in user's own entries.

export async function fetchMonthEntries(month: string): Promise<JournalEntry[]> {
  const [y, m] = month.split("-").map(Number);
  const first = `${month}-01`;
  const last = toDateKey(new Date(y, m, 0)); // day 0 of next month = last day of this one

  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, entry_date, content, mood, symptoms")
    .gte("entry_date", first)
    .lte("entry_date", last);

  if (error) throw error;
  return data ?? [];
}

export async function saveEntry(userId: string, key: string, draft: Draft): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        user_id: userId,
        entry_date: key,
        content: draft.content,
        mood: draft.mood,
        symptoms: draft.symptoms,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,entry_date" }
    )
    .select("id, entry_date, content, mood, symptoms")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEntry(key: string) {
  const { error } = await supabase.from("journal_entries").delete().eq("entry_date", key);
  if (error) throw error;
}

export function addMonths(month: string, step: number) {
  const [y, m] = month.split("-").map(Number);
  return toDateKey(new Date(y, m - 1 + step, 1)).slice(0, 7);
}