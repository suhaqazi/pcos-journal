import Image from "next/image";
import { ReactNode } from "react";

// The cream card with corner brackets that opens each landing section
export default function SectionIntro({
  eyebrow,
  description,
  children,
}: {
  eyebrow: string;
  description?: string;
  children: ReactNode; // the headline
}) {
  return (
    <div className="relative mb-14 w-full max-w-[55rem] rounded-[1.75rem] bg-paper px-6 pt-6 pb-9 text-center md:mb-24 md:rounded-card md:px-12 md:pt-8 md:pb-12">
      <Image
        src="/corner-bracket.svg"
        alt=""
        width={96}
        height={96}
        className="pointer-events-none absolute -top-[0.3rem] -left-2 size-14 md:-top-[0.4rem] md:-left-4 md:size-24"
      />
      <Image
        src="/corner-bracket.svg"
        alt=""
        width={96}
        height={96}
        className="pointer-events-none absolute -right-2 -bottom-[0.3rem] size-14 rotate-180 md:-right-4 md:-bottom-[0.4rem] md:size-24"
      />

      <p className="mb-2 text-sm leading-[2.2] font-light tracking-[-0.02em] text-ink uppercase md:text-base md:leading-[2.5]">
        {eyebrow}
      </p>
      <h2 className="text-headline leading-[1.4] font-black tracking-[0.02em] text-ink">
        {children}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-[50rem] text-intro leading-relaxed font-light tracking-[-0.02em] text-ink md:mt-6 md:leading-loose">
          {description}
        </p>
      )}
    </div>
  );
}
