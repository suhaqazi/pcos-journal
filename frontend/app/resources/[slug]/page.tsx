import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import TextLink from "@/components/ui/TextLink";
import {
  EXPLAINERS,
  GUIDELINE_URL,
  getExplainer,
  readMinutes,
} from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXPLAINERS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const explainer = getExplainer((await params).slug);
  return explainer
    ? {
        title: `${explainer.title} · Ask Orchid`,
        description: explainer.summary,
      }
    : {};
}

export default async function ExplainerPage({ params }: Props) {
  const explainer = getExplainer((await params).slug);
  if (!explainer) notFound();

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 pt-10 pb-24">
      <article className="mx-auto max-w-3xl rounded-card bg-paper px-8 py-10 md:px-14 md:py-14">
        <TextLink href="/resources" className="text-small">
          ← All resources
        </TextLink>

        <p className="mt-6 font-hand text-body font-bold text-muted">
          {readMinutes(explainer)} min read
        </p>
        <h1 className="mt-1 mb-8 text-headline leading-tight font-black text-burgundy">
          {explainer.title}
        </h1>

        <div className="flex flex-col gap-8">
          {explainer.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-3 text-title font-black text-ink">
                {s.heading}
              </h2>
              <div className="flex flex-col gap-3 text-lead leading-relaxed text-stone">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sage-light px-6 py-5">
          <p className="mb-3 text-body text-ink">
            Still have a question about this?
          </p>
          <Button href="/ask" size="sm">
            Ask Orchid →
          </Button>
        </div>

        <p className="mt-8 text-caption text-muted">
          Based on the{" "}
          <a
            href={GUIDELINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            2023 International Evidence-based Guideline for PCOS
          </a>
          . For information only, not medical advice. Always talk with your
          healthcare provider about your own situation.
        </p>
      </article>
    </main>
  );
}
