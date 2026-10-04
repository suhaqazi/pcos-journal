import Image from "next/image";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pt-14 pb-16">
      <div className="relative flex w-full max-w-[57.875rem] flex-col items-center rounded-card bg-paper px-12 py-16 text-center">
        {/* Decorations around the card */}
        <Image
          src="/pushpin.svg"
          alt=""
          width={80}
          height={100}
          className="pointer-events-none absolute -top-6 -left-[1.2rem] z-10 -rotate-8 -scale-x-100"
        />
        <Image
          src="/pinksticker.svg"
          alt=""
          width={400}
          height={80}
          className="pointer-events-none absolute -top-36 -right-44 z-10 rotate-20"
        />
        <Image
          src="/star.svg"
          alt=""
          width={95}
          height={78}
          className="pointer-events-none absolute -top-4 -right-[2.3rem] z-11"
        />
        <Image
          src="/star.svg"
          alt=""
          width={110}
          height={70}
          className="pointer-events-none absolute bottom-4 -left-14 z-10"
        />
        <Image
          src="/button.svg"
          alt=""
          width={100}
          height={70}
          className="pointer-events-none absolute -bottom-8 -left-2 z-10"
        />

        <div className="mb-8 rounded-full bg-sage-light px-6 py-2 text-sm font-semibold tracking-[0.08em] text-ink uppercase">
          Grounded in clinical guidelines
        </div>

        <h1 className="mb-12 max-w-[48.9375rem] text-hero leading-[1.4] font-bold">
          <span className="text-ink">Understand your body, </span>
          <span className="underline-doodle text-burgundy">
            one page at a time
          </span>
        </h1>

        <p className="mb-12 max-w-[51.6875rem] text-intro leading-normal font-light tracking-[-0.02em] text-ink">
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

        <p className="text-sm text-ink/80">
          Not ready for an account?{" "}
          <TextLink href="/ask">Try Ask without an account</TextLink>
        </p>
      </div>
    </section>
  );
}
