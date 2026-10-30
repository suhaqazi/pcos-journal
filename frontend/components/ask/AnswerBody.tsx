import { AnswerData } from "@/lib/answer";

// Orchid's answer: summary, points and closing. Used on the desktop answer
// paper and in the chat bubbles on smaller screens.
export default function AnswerBody({ answer }: { answer: AnswerData }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-lead leading-snug font-bold text-ink italic">
        {answer.summary}
      </p>
      {answer.points.map((point) => (
        <div key={point.heading} className="text-body">
          <p className="mb-0.5 font-bold text-burgundy">{point.heading}</p>
          <p className="leading-relaxed text-ink">{point.body}</p>
        </div>
      ))}
      <p className="text-small leading-snug text-muted italic">
        {answer.closing}
      </p>
    </div>
  );
}
