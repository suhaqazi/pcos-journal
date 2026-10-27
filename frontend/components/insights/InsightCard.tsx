import { ReactNode } from "react";

// The cream card every insight sits in
export default function InsightCard({
  title,
  note,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-card bg-paper p-6 md:p-8 ${className}`}>
      <h2 className="text-title font-black text-burgundy">{title}</h2>
      {note && <p className="mt-1 text-small text-muted">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
