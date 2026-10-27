// How many days each symptom was logged this month
export default function SymptomBars({
  counts,
}: {
  counts: { symptom: string; count: number }[];
}) {
  if (counts.length === 0) {
    return (
      <p className="text-body text-muted">No symptoms logged this month.</p>
    );
  }

  const max = counts[0].count;

  return (
    <ul className="flex flex-col gap-3">
      {counts.map(({ symptom, count }) => (
        <li key={symptom}>
          <div className="mb-1 flex justify-between text-small text-ink">
            <span>{symptom}</span>
            <span className="text-muted">
              {count} {count === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-burgundy/10">
            {/* Width comes from the data, so it's an inline style */}
            <div
              className="h-full rounded-full bg-burgundy/70"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
