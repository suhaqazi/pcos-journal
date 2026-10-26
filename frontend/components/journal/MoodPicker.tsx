import Button from "@/components/ui/Button";
import { MOODS, MoodId, SYMPTOMS } from "@/lib/journal";

interface MoodPickerProps {
  mood: MoodId | null;
  symptoms: string[];
  onMood: (mood: MoodId | null) => void;
  onToggleSymptom: (symptom: string) => void;
}

// Mood and symptom tags for the selected day, under the calendar
export default function MoodPicker({
  mood,
  symptoms,
  onMood,
  onToggleSymptom,
}: MoodPickerProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-dashed border-burgundy/30 pt-4">
      <div>
        <h3 className="mb-2 font-hand text-body font-bold text-burgundy not-italic">
          How are you feeling?
        </h3>
        <div className="flex flex-wrap gap-1.5">
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
      </div>

      <div>
        <h3 className="mb-2 font-hand text-body font-bold text-burgundy not-italic">
          Anything your body did?
        </h3>
        <div className="flex flex-wrap gap-1.5">
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
      </div>
    </div>
  );
}
