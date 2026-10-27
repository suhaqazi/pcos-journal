import Image from "next/image";

// The tape-label page header (ask, journal, insights). Its text is sized in cqw
// (% of the label's width), so the words scale WITH the label. On phones
// the description moves under the label, where it stays readable.

interface PageLabelProps {
  title: string;
  subtitle: string;
  description: string;
  className?: string; // size and position of the label, e.g. "md:w-[54.44%]"
}

export default function PageLabel({
  title,
  subtitle,
  description,
  className = "",
}: PageLabelProps) {
  return (
    <>
      <div className={`@container relative w-full ${className}`}>
        <Image
          src="/askpagehead.svg"
          alt=""
          width={720}
          height={180}
          priority
          className="block h-auto w-full"
        />
        <div className="absolute inset-x-[12%] top-[22%] bottom-[12%] flex flex-col items-center justify-center text-center">
          <h1 className="text-[7cqw] leading-tight font-black text-burgundy md:text-[4.5cqw]">
            {title}
          </h1>
          <p className="text-[3.8cqw] font-bold text-ink md:mb-[1.2cqw] md:text-[2.4cqw]">
            {subtitle}
          </p>
          <p className="hidden text-[1.9cqw] leading-snug text-ink md:block">
            {description}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-paper/90 px-4 py-3 text-center text-small text-ink md:hidden">
        {description}
      </p>
    </>
  );
}
