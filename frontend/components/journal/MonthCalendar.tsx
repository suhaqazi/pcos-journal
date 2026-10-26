import { JournalEntry, fromDateKey, moodById, toDateKey } from "@/lib/journal";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface MonthCalendarProps {
  month: string; // "2026-10"
  selectedKey: string;
  today: string;
  entries: Record<string, JournalEntry>;
  onSelect: (key: string) => void;
  onMonthChange: (step: -1 | 1) => void;
}

export default function MonthCalendar({
  month,
  selectedKey,
  today,
  entries,
  onSelect,
  onMonthChange,
}: MonthCalendarProps) {
  const first = fromDateKey(`${month}-01`);
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0,
  ).getDate();
  const leadingBlanks = first.getDay(); // 0 = Sunday
  const isCurrentMonth = month === today.slice(0, 7);

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    toDateKey(new Date(first.getFullYear(), first.getMonth(), i + 1)),
  );

  return (
    <div>
      {/* Month heading with arrows */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-title font-black text-ink">
          {first.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex">
          <button
            type="button"
            onClick={() => onMonthChange(-1)}
            aria-label="Previous month"
            className="cursor-pointer px-2 text-title text-burgundy hover:text-burgundy-deep"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(1)}
            disabled={isCurrentMonth}
            aria-label="Next month"
            className="cursor-pointer px-2 text-title text-burgundy hover:text-burgundy-deep disabled:pointer-events-none disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center font-hand text-small font-bold text-muted">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((key) => {
          const entry = entries[key];
          const mood = moodById(entry?.mood ?? null);
          const isSelected = key === selectedKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              disabled={key > today}
              aria-label={fromDateKey(key).toDateString()}
              aria-pressed={isSelected}
              className={`mx-auto flex size-9 cursor-pointer flex-col items-center justify-center rounded-full font-hand text-body transition disabled:pointer-events-none disabled:opacity-30 ${
                isSelected
                  ? "bg-burgundy text-paper"
                  : "text-ink hover:bg-burgundy/10"
              } ${key === today && !isSelected ? "font-bold underline underline-offset-2" : ""}`}
            >
              {Number(key.slice(8))}
              {/* Mood color if they picked one, a plain dot if they only wrote */}
              <span
                className={`size-1.5 rounded-full ${
                  mood ? mood.dot : entry ? "bg-muted/50" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
