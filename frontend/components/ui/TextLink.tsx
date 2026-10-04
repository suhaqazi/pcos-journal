import Link from "next/link";
import { ComponentProps } from "react";

// Underlined link that sits inside a sentence ("New here? Create an account").
// For stand-alone actions, use <Button variant="link"> instead.
export default function TextLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`font-semibold text-burgundy underline underline-offset-[3px] hover:text-burgundy-deep ${className}`}
    />
  );
}
