import type { Metadata } from "next";
import PageLabel from "@/components/ui/PageLabel";
import Bookcase from "@/components/resources/Bookcase";
import LibraryCard from "@/components/resources/LibraryCard";
import PinnedNote from "@/components/resources/PinnedNote";
import StartHere from "@/components/resources/StartHere";
import { TRUSTED_LINKS, getExplainer } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources · Ask Orchid",
  description:
    "Short, trustworthy reads about PCOS, plus links to sources we trust.",
};

// Library cards lean slightly different ways, like real pinned cards
const TILTS = [
  "-rotate-1",
  "rotate-1",
  "rotate-[0.5deg]",
  "-rotate-[1.5deg]",
  "rotate-[1.5deg]",
];

// Section titles sit on a small cream tab so they read clearly on the stripes
function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-6 inline-block rounded-full bg-paper px-5 py-1.5 font-hand text-title font-bold text-burgundy not-italic">
      {children}
    </h2>
  );
}

export default function ResourcesPage() {
  const renameNote = getExplainer("pcos-new-name")!;

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-8 pt-8 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <PageLabel
            title="Resources"
            subtitle="Reading you can trust"
            description="Short reads written for you, plus links to the sources we trust most. Clear, kind and grounded in the international PCOS guideline."
            className="md:ml-[4.9%] md:w-[54.44%]"
          />
        </div>

        {/* News and a starting path */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <PinnedNote explainer={renameNote} label="News · May 2026" />
          <StartHere />
        </div>

        <section className="mb-16">
          <SectionTitle>The shelf</SectionTitle>
          <Bookcase />
        </section>

        <section>
          <SectionTitle>Trusted sources</SectionTitle>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TRUSTED_LINKS.map((link, i) => (
              <li key={link.url}>
                <LibraryCard link={link} tilt={TILTS[i % TILTS.length]} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
