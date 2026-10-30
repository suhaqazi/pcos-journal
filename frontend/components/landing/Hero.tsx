import Image from "next/image";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";

export default function Hero() {
  return (
    // overflow-x-clip: the stickers hang past the card; this stops them
    // making the page scroll sideways on phones
    <section className="relative flex flex-col items-center overflow-x-clip px-4 pt-10 pb-12 md:pt-14 md:pb-16">
      <div className="relative flex w-full max-w-[57.875rem] flex-col items-center rounded-[1.75rem] bg-paper px-6 py-12 text-center md:rounded-card md:px-12 md:py-16">
        {/* Decorations around the card */}
        <Image
          src="/pushpin.svg"
          alt=""
          width={80}
          height={100}
          className="pointer-events-none absolute -top-5 -left-3 z-10 h-auto w-12 -rotate-8 -scale-x-100 md:-top-6 md:-left-[1.2rem] md:w-20"
        />
        <Image
          src="/pinksticker.svg"
          alt=""
          width={400}
          height={80}
          className="pointer-events-none absolute -top-16 -right-24 z-10 h-auto w-48 rotate-20 md:-top-36 md:-right-44 md:w-[400px]"
        />
        <Image
          src="/star.svg"
          alt=""
          width={95}
          height={78}
          className="pointer-events-none absolute -top-3 -right-4 z-11 h-auto w-12 md:-top-4 md:-right-[2.3rem] md:w-[95px]"
        />
        <Image
          src="/star.svg"
          alt=""
          width={110}
          height={70}
          className="pointer-events-none absolute bottom-4 -left-6 z-10 h-auto w-14 md:-left-14 md:w-[110px]"
        />
        <Image
          src="/button.svg"
          alt=""
          width={100}
          height={70}
          className="pointer-events-none absolute -bottom-5 -left-2 z-10 h-auto w-12 md:-bottom-8 md:w-[100px]"
        />

        <div className="mb-6 rounded-full bg-sage-light px-4 py-1.5 text-xs font-semibold tracking-[0.08em] text-ink uppercase md:mb-8 md:px-6 md:py-2 md:text-sm">
          Grounded in clinical guidelines
        </div>

        <h1 className="mb-8 max-w-[48.9375rem] text-hero leading-[1.4] font-bold md:mb-12">
          <span className="text-ink">Understand your body, </span>
          <span className="underline-doodle text-burgundy">
            one page at a time
          </span>
        </h1>

        <p className="mb-8 max-w-[51.6875rem] text-intro leading-normal font-light tracking-[-0.02em] text-ink md:mb-12">
          Ask Orchid is a warm, private place to ask the questions you've been
          holding, write down what your body is doing, and slowly see the
          patterns underneath. No jargon, no judgement - just your own pages,
          taken seriously.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          <Button href="/ask">Get Started →</Button>
          <Button href="/login" variant="secondary">
            Sign in
          </Button>
        </div>

        <p className="text-small text-ink/80">
          Not ready for an account?{" "}
          <TextLink href="/ask">Try Ask without an account</TextLink>
        </p>
      </div>
    </section>
  );
}
