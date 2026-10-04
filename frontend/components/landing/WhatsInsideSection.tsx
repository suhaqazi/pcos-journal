import Image from "next/image";
import Button from "@/components/ui/Button";
import SectionIntro from "@/components/landing/SectionIntro";

const CARDS = [
  {
    title: "Questions answered kindly",
    body: "PCOS comes with a lot of noise. Ask anything - from irregular cycles to hair changes to what a diagnosis even means - and get a clear, supportive answer in seconds.",
    link: "Try Ask without an account →",
    href: "/ask",
  },
  {
    title: "A notebook that remembers",
    body: "Write a few lines, tag how you felt, note what your body did. Entries stay private to you and build into a record you can bring to an appointment.",
    link: "Start your journal →",
    href: "/journal",
  },
  {
    title: "See the shape of your weeks",
    body: "Mood and symptom summaries drawn straight from your own entries, so you can spot what helps and what doesn't - without guessing.",
    link: "Look at your insights →",
    href: "/insights",
  },
  {
    title: "Reading you can trust",
    body: "A small, curated shelf of PCOS explainers - symptoms, treatment options, and how to advocate for yourself in a ten-minute appointment.",
    link: "Browse resources →",
    href: "/resources",
  },
];

export default function WhatsInsideSection() {
  return (
    <section className="flex flex-col items-center px-4 pt-24 pb-16">
      <SectionIntro eyebrow="What's inside">
        Everything a <span className="underline-doodle">hard week</span> needs
      </SectionIntro>

      <div className="grid w-full max-w-[82rem] gap-12 px-8 md:grid-cols-2">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="relative flex flex-col gap-4 rounded-card bg-paper px-[1.9rem] pt-4 pb-6"
          >
            <Image
              src="/redbookmark.svg"
              alt=""
              width={192}
              height={192}
              className="pointer-events-none absolute -top-[4.4rem] -left-12 h-auto w-48"
            />
            <h3 className="mt-6 text-title leading-tight font-black text-ink">
              {card.title}
            </h3>
            <p className="grow text-[0.9375rem] leading-relaxed text-stone">
              {card.body}
            </p>
            <Button href={card.href} variant="link" className="mt-2 self-start">
              {card.link}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
