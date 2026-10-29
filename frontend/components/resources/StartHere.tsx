import Link from "next/link";
import { Explainer, START_HERE, getExplainer } from "@/lib/resources";

// A short, numbered reading path for someone newly diagnosed
export default function StartHere() {
  const steps = START_HERE.map(getExplainer).filter(
    (e): e is Explainer => e !== undefined,
  );

  return (
    <div className="h-full rotate-1 rounded-sm bg-blush px-8 pt-8 pb-7 shadow-[3px_4px_0_rgb(0_0_0/0.12)]">
      <p className="font-hand text-body font-bold text-burgundy">
        New to PCOS?
      </p>
      <h2 className="mt-1 mb-5 text-title leading-tight font-black text-ink">
        Start here
      </h2>

      <ol className="flex flex-col gap-3">
        {steps.map((e, i) => (
          <li key={e.slug}>
            <Link
              href={`/resources/${e.slug}`}
              className="group flex items-center gap-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-burgundy font-hand text-body font-bold text-burgundy">
                {i + 1}
              </span>
              <span className="text-body font-semibold text-ink group-hover:text-burgundy group-hover:underline">
                {e.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
