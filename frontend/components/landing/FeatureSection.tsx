import Image from "next/image";
import SectionIntro from "@/components/landing/SectionIntro";

// Ribbons are placed exactly as in the design, measured from
// each card's top-left corner. They sit in a fixed 24rem "anchor"
// (the desktop card's width), so a ribbon looks the same on every card
// no matter how wide the card is. On phones the anchor scales down.
const FEATURES = [
  {
    ribbon: "Ask",
    title: "A gentle place to start",
    body: "Ask the questions that feel too small or too scary to say out loud. You get a warm, plain-language answer - and a nudge toward real care when it matters.",
    ribbonClass: "-top-14 -left-72 -rotate-1",
    labelClass: "top-16 -rotate-[35deg]",
    imageClass: "",
  },
  {
    ribbon: "Journal",
    title: "A page of your own",
    body: "Dated entries with mood and symptom tags, so a hard week becomes a pattern you can actually show your clinician.",
    ribbonClass: "-top-18 -left-[15.6rem] rotate-[31deg]",
    labelClass: "top-[3.8rem] left-[17.5rem] -rotate-[31deg]",
    imageClass: "",
  },
  {
    ribbon: "Insights",
    title: "Patterns, not verdicts",
    body: "Your moods and symptoms gathered into a calm little chart. No scores, no judgement - just what your own pages are telling you.",
    ribbonClass: "-top-14 -left-[15.6rem] rotate-[11deg]",
    labelClass: "top-[3.3rem] left-[16.7rem] -rotate-[31deg]",
    imageClass: "-scale-100",
  },
];

export default function FeatureSection() {
  return (
    // overflow-x-clip: ribbons hang past the cards, so stop them
    // from making the whole page scroll sideways on small screens
    <section className="flex flex-col items-center overflow-x-clip px-4 pt-24 pb-16">
      <SectionIntro
        eyebrow="Three pages, one notebook"
        description="Each part of Ask Orchid does one job well - and they all feed the same quiet record of your health."
      >
        Ask, write, and <span className="underline-doodle">notice</span>
      </SectionIntro>

      {/* Stacked: long cards, no wider than the intro card above (55rem).
          From xl (1280px): three columns, each at the designed 24rem. */}
      <div className="grid w-full max-w-[55rem] gap-y-16 px-8 xl:max-w-[83rem] xl:grid-cols-3 xl:gap-x-14">
        {FEATURES.map((f) => (
          <div
            key={f.ribbon}
            className="relative rounded-card bg-paper px-6 py-8"
          >
            {/* Ribbon anchor */}
            <div className="pointer-events-none absolute top-0 left-0 w-[24rem] origin-top-left max-sm:scale-75">
              <div
                className={`absolute z-10 inline-flex items-center justify-center ${f.ribbonClass}`}
              >
                <Image
                  src="/ribbon.svg"
                  alt=""
                  width={640}
                  height={144}
                  className={`block h-36 w-[40rem] max-w-none ${f.imageClass}`}
                />
                <span
                  className={`absolute font-display text-[1.3rem] font-black text-burgundy italic ${f.labelClass}`}
                >
                  {f.ribbon}
                </span>
              </div>
            </div>

            <h3 className="mt-8 mb-3 text-title leading-tight font-black text-burgundy">
              {f.title}
            </h3>
            <p className="text-[0.9375rem] leading-relaxed text-stone">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
