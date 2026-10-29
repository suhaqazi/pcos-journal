import Image from "next/image";
import { TrustedLink } from "@/lib/resources";

// An old-style library card, pinned up, linking to an outside source
export default function LibraryCard({
  link,
  tilt,
}: {
  link: TrustedLink;
  tilt: string;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block h-full rounded-sm bg-paper px-6 pt-8 pb-5 shadow-[3px_4px_0_rgb(0_0_0/0.12)] transition duration-200 hover:rotate-0 ${tilt}`}
    >
      <Image
        src="/pushpin.svg"
        alt=""
        width={32}
        height={40}
        className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2"
      />

      {/* Card header rule, like a library card's red top line */}
      <div className="mb-3 flex items-baseline justify-between border-b-2 border-burgundy/40 pb-1">
        <span className="font-hand text-small font-bold tracking-wide text-burgundy uppercase">
          {link.source}
        </span>
        <span aria-hidden="true" className="text-burgundy">
          ↗
        </span>
      </div>

      <div className="lined-paper leading-8">
        <h3 className="font-body text-body font-bold text-ink not-italic">
          {link.title}
        </h3>
        <p className="text-small text-stone">{link.description}</p>
      </div>
    </a>
  );
}
