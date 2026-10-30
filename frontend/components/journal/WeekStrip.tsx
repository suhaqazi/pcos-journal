import { JournalEntry, addDays, fromDateKey, moodById } from "@/lib/journal";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface WeekStripProps {
  selectedKey: string;
  today: string;
  entries: Record<string, JournalEntry>;
  onSelect: (key: string) => void;
}

// One week (Sunday to Saturday) around the selected day: the compact
// calendar for smaller screens. Arrows move a week at a time.
export default function WeekStrip({
  selectedKey,
  today,
  entries,
  onSelect,
}: WeekStripProps) {
  const weekStart = addDays(selectedKey, -fromDateKey(selectedKey).getDay());
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const canGoForward = addDays(weekStart, 7) <= today;

  // Moving a week keeps the same weekday, but never goes past today
  const jump = (step: -7 | 7) => {
    const target = addDays(selectedKey, step);
    onSelect(target > today ? today : target);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => jump(-7)}
        aria-label="Previous week"
        className="cursor-pointer px-1.5 text-title text-burgundy"
      >
        ‹
      </button>

      <div className="grid flex-1 grid-cols-7">
        {days.map((key, i) => {
          const entry = entries[key];
          const mood = moodById(entry?.mood ?? null);
          const isSelected = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              disabled={key > today}
              aria-pressed={isSelected}
              aria-label={fromDateKey(key).toDateString()}
              className="flex cursor-pointer flex-col items-center gap-1 disabled:pointer-events-none disabled:opacity-30"
            >
              <span className="font-hand text-caption font-bold text-muted">
                {WEEKDAYS[i]}
              </span>
              <span
                className={`flex size-9 items-center justify-center rounded-full font-hand text-body ${
                  isSelected ? "bg-burgundy text-paper" : "text-ink"
                } ${key === today && !isSelected ? "font-bold underline underline-offset-2" : ""}`}
              >
                {Number(key.slice(8))}
              </span>
              <span
                className={`size-1.5 rounded-full ${
                  mood ? mood.dot : entry ? "bg-muted/50" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => jump(7)}
        disabled={!canGoForward}
        aria-label="Next week"
        className="cursor-pointer px-1.5 text-title text-burgundy disabled:pointer-events-none disabled:opacity-25"
      >
        ›
      </button>
    </div>
  );
}
