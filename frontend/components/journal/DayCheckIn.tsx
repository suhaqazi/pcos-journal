import Button from "@/components/ui/Button";
import { MOODS, MoodId, SYMPTOMS, fromDateKey, todayKey } from "@/lib/journal";

interface DayCheckInProps {
  dateKey: string;
  mood: MoodId | null;
  symptoms: string[];
  onMood: (mood: MoodId | null) => void;
  onToggleSymptom: (symptom: string) => void;
}

// "How was today?" — mood and symptom tags for the selected day
export default function DayCheckIn({
  dateKey,
  mood,
  symptoms,
  onMood,
  onToggleSymptom,
}: DayCheckInProps) {
  const dayLabel =
    dateKey === todayKey()
      ? "today"
      : fromDateKey(dateKey).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });

  return (
    <section className="rounded-card bg-paper px-8 py-8 md:px-12">
      <h2 className="mb-1 text-title font-bold text-ink">
        How was {dayLabel}?
      </h2>
      <p className="mb-6 text-small text-muted">
        Tap what fits. These build your insights over time, and save
        automatically.
      </p>

      <h3 className="mb-2 font-hand text-body font-bold text-burgundy not-italic">
        Mood
      </h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {MOODS.map((m) => {
          const selected = mood === m.id;
          return (
            <Button
              key={m.id}
              variant={selected ? "chipActive" : "chip"}
              aria-pressed={selected}
              onClick={() => onMood(selected ? null : m.id)}
            >
              <span className={`size-2.5 rounded-full ${m.dot}`} />
              {m.label}
            </Button>
          );
        })}
      </div>

      <h3 className="mb-2 font-hand text-body font-bold text-burgundy not-italic">
        Anything your body did?
      </h3>
      <div className="flex flex-wrap gap-2">
        {SYMPTOMS.map((s) => {
          const selected = symptoms.includes(s);
          return (
            <Button
              key={s}
              variant={selected ? "chipActive" : "chip"}
              aria-pressed={selected}
              onClick={() => onToggleSymptom(s)}
            >
              {s}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
