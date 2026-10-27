import Button from "@/components/ui/Button";
import { FLOWS, FlowId, MOODS, MoodId, SYMPTOMS } from "@/lib/journal";

interface MoodPickerProps {
  mood: MoodId | null;
  flow: FlowId | null;
  symptoms: string[];
  onMood: (mood: MoodId | null) => void;
  onFlow: (flow: FlowId | null) => void;
  onToggleSymptom: (symptom: string) => void;
}

const heading = "mb-2 font-hand text-body font-bold text-burgundy not-italic";

// Mood, period and symptom tags for the selected day, under the calendar.
// Tapping a selected mood or flow again clears it.
export default function MoodPicker({
  mood,
  flow,
  symptoms,
  onMood,
  onFlow,
  onToggleSymptom,
}: MoodPickerProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-dashed border-burgundy/30 pt-4">
      <div>
        <h3 className={heading}>How are you feeling?</h3>
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
        <h3 className={heading}>Period today?</h3>
        <div className="flex flex-wrap gap-1.5">
          {FLOWS.map((f) => {
            const selected = flow === f.id;
            return (
              <Button
                key={f.id}
                variant={selected ? "chipActive" : "chip"}
                aria-pressed={selected}
                onClick={() => onFlow(selected ? null : f.id)}
              >
                {f.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={heading}>Anything your body did?</h3>
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
        <p className="mt-2 text-caption text-muted">
          Something else? Write about it on your page.
        </p>
      </div>
    </div>
  );
}
