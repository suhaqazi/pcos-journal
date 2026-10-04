import Link from "next/link";
import { ComponentProps } from "react";

// The one button for the whole app. Pass `href` to get a link
// (Next.js <Link>), leave it out to get a real <button>.
//
//   <Button href="/signup">Get started</Button>
//   <Button variant="secondary" size="sm" onClick={signOut}>Sign out</Button>
//   <Button variant="chip" onClick={() => setQuestion(q)}>{q}</Button>
//   <Button variant="link" onClick={reset}>Ask another →</Button>

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "cursor-pointer transition duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy " +
  "disabled:pointer-events-none";

const variants = {
  // Olive gradient — the main action on any screen
  primary:
    "bg-radial from-olive to-olive-dark text-cream " +
    "hover:opacity-90 hover:-translate-y-px " +
    "disabled:bg-none disabled:bg-disabled",
  // Blush with burgundy border — the second choice next to a primary
  secondary:
    "bg-blush text-burgundy border border-burgundy " +
    "hover:bg-burgundy hover:text-blush hover:-translate-y-px",
  // Small outlined pill — suggested questions, tags
  chip:
    "px-3 py-1 text-small font-normal text-left justify-start " +
    "text-burgundy border border-burgundy/25 hover:bg-burgundy/5",
  // Plain text action — "Ask another →", "Browse resources →"
  link: "text-burgundy hover:underline underline-offset-4",
};

// Only primary and secondary use sizes; chip and link size themselves
const sizes = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-[0.9375rem]",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = CommonProps & ComponentProps<typeof Link>;
type ButtonAsButton = CommonProps &
  ComponentProps<"button"> & { href?: undefined };

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className = "", ...rest } = props;

  const classes = [
    base,
    variants[variant],
    variant === "primary" || variant === "secondary" ? sizes[size] : "",
    className,
  ].join(" ");

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as ComponentProps<typeof Link>)} className={classes} />
    );
  }

  return (
    <button
      type="button"
      {...(rest as ComponentProps<"button">)}
      className={classes}
    />
  );
}
