// Three quick numbers across the top
export default function StatTiles({
  monthName,
  pages,
  currentStreak,
  longestStreak,
}: {
  monthName: string;
  pages: number;
  currentStreak: number;
  longestStreak: number;
}) {
  const tiles = [
    {
      value: pages,
      label: `${pages === 1 ? "page" : "pages"} in ${monthName}`,
    },
    {
      value: currentStreak,
      label: `${currentStreak === 1 ? "day" : "days"} in a row`,
    },
    { value: longestStreak, label: "longest streak" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="rounded-card bg-paper px-6 py-5 text-center"
        >
          <p className="font-display text-headline leading-none font-black text-burgundy italic">
            {t.value}
          </p>
          <p className="mt-2 font-hand text-body font-bold text-ink">
            {t.label}
          </p>
        </div>
      ))}
    </div>
  );
}
