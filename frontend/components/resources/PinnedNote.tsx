import Link from "next/link";
import { Explainer } from "@/lib/resources";

// A paper note taped to the page, for news worth seeing first
export default function PinnedNote({
  explainer,
  label,
}: {
  explainer: Explainer;
  label: string;
}) {
  return (
    <Link
      href={`/resources/${explainer.slug}`}
      className="relative block -rotate-1 rounded-sm bg-paper px-8 pt-10 pb-7 shadow-[3px_4px_0_rgb(0_0_0/0.12)] transition duration-200 hover:rotate-0"
    >
      {/* Strip of tape */}
      <span className="absolute -top-3 left-1/2 h-7 w-32 -translate-x-1/2 -rotate-3 bg-sage-light/90 shadow-sm" />

      <p className="font-hand text-body font-bold text-burgundy">{label}</p>
      <h2 className="mt-1 text-title leading-tight font-black text-ink">
        {explainer.title}
      </h2>
      <p className="mt-2 text-body text-stone">{explainer.summary}</p>
      <span className="mt-4 inline-block font-semibold text-burgundy">
        Read the note →
      </span>
    </Link>
  );
}
