import Image from "next/image";
import Link from "next/link";

// The orchid + "Ask Orchid" wordmark, linking home.
// Row in the navbar, stacked in the footer and on auth pages.
const sizes = {
  sm: { image: 32, imageClass: "size-8", text: "text-xl" },
  md: { image: 60, imageClass: "size-[60px]", text: "text-[1.375rem]" },
  lg: {
    image: 130,
    imageClass: "size-16 md:size-[130px]",
    text: "text-xl md:text-2xl",
  },
};

interface LogoProps {
  size?: keyof typeof sizes;
  stacked?: boolean;
  className?: string; // e.g. alignment: "items-center" or "items-start"
}

export default function Logo({
  size = "sm",
  stacked = false,
  className = "",
}: LogoProps) {
  const { image, imageClass, text } = sizes[size];

  return (
    <Link
      href="/"
      className={`flex ${stacked ? "flex-col gap-1" : "items-center gap-2.5"} ${className}`}
    >
      <Image
        src="/orchid.svg"
        alt=""
        width={image}
        height={image}
        className={imageClass}
      />
      <span className={`font-display font-black text-burgundy italic ${text}`}>
        Ask Orchid
      </span>
    </Link>
  );
}
