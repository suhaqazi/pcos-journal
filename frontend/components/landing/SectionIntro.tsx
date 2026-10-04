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
    <div className="relative mb-24 w-full max-w-[55rem] rounded-card bg-paper px-12 pt-8 pb-12 text-center">
      <Image
        src="/corner-bracket.svg"
        alt=""
        width={96}
        height={96}
        className="pointer-events-none absolute -top-[0.4rem] -left-4 size-24"
      />
      <Image
        src="/corner-bracket.svg"
        alt=""
        width={96}
        height={96}
        className="pointer-events-none absolute -right-4 -bottom-[0.4rem] size-24 rotate-180"
      />

      <p className="mb-2 leading-[2.5] font-light tracking-[-0.02em] text-ink uppercase">
        {eyebrow}
      </p>
      <h2 className="text-headline leading-[1.4] font-black tracking-[0.02em] text-ink">
        {children}
      </h2>
      {description && (
        <p className="mx-auto mt-6 max-w-[50rem] text-intro leading-loose font-light tracking-[-0.02em] text-ink">
          {description}
        </p>
      )}
    </div>
  );
}
