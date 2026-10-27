import { InsightEntry } from "@/lib/insights";
import { MOODS, fromDateKey, moodById, toDateKey } from "@/lib/journal";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Read-only month view: each day shows the mood picked for it
export default function MoodCalendar({
  month,
  today,
  entries,
}: {
  month: string;
  today: string;
  entries: InsightEntry[];
}) {
  const first = fromDateKey(`${month}-01`);
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0,
  ).getDate();
  const byDay = new Map(entries.map((e) => [e.entry_date, e]));

  return (
    <div>
      <div className="grid grid-cols-7 text-center font-hand text-small font-bold text-muted">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-2">
        {Array.from({ length: first.getDay() }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const key = toDateKey(
            new Date(first.getFullYear(), first.getMonth(), i + 1),
          );
          const mood = moodById(byDay.get(key)?.mood ?? null);
          return (
            <div
              key={key}
              className={`flex flex-col items-center gap-1 ${key > today ? "opacity-30" : ""}`}
              title={
                mood
                  ? `${fromDateKey(key).toDateString()}: ${mood.label}`
                  : undefined
              }
            >
              <span className="font-hand text-small text-ink">{i + 1}</span>
              <span
                className={`size-5 rounded-full ${
                  mood ? mood.dot : "border border-dashed border-burgundy/25"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
        {MOODS.map((m) => (
          <span
            key={m.id}
            className="flex items-center gap-1.5 text-caption text-ink"
          >
            <span className={`size-2.5 rounded-full ${m.dot}`} />
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
