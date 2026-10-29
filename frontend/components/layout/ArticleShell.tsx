import { ReactNode } from "react";
import TextLink from "@/components/ui/TextLink";

// The cream paper page used for articles, Privacy, Terms and Contact:
// wallpaper behind, one readable column of text in front.

export interface Section {
  heading: string;
  paragraphs: string[];
}

interface ArticleShellProps {
  title: string;
  eyebrow?: string; // small handwritten line above the title
  back?: { href: string; label: string };
  children: ReactNode;
}

export default function ArticleShell({
  title,
  eyebrow,
  back,
  children,
}: ArticleShellProps) {
  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 pt-10 pb-24">
      <article className="mx-auto max-w-3xl rounded-card bg-paper px-8 py-10 md:px-14 md:py-14">
        {back && (
          <TextLink href={back.href} className="text-small">
            ← {back.label}
          </TextLink>
        )}
        {eyebrow && (
          <p className="mt-6 font-hand text-body font-bold text-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 mb-8 text-headline leading-tight font-black text-burgundy">
          {title}
        </h1>
        {children}
      </article>
    </main>
  );
}

// Headings and paragraphs, in the article style
export function ArticleSections({ sections }: { sections: Section[] }) {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="mb-3 text-title font-black text-ink">{s.heading}</h2>
          <div className="flex flex-col gap-3 text-lead leading-relaxed text-stone">
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
