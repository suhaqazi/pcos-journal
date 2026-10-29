import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleShell, {
  ArticleSections,
} from "@/components/layout/ArticleShell";
import Button from "@/components/ui/Button";
import {
  EXPLAINERS,
  GUIDELINE_URL,
  getExplainer,
  readMinutes,
} from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

// Build every article page ahead of time: they're static content
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
    <ArticleShell
      title={explainer.title}
      eyebrow={`${readMinutes(explainer)} min read`}
      back={{ href: "/resources", label: "All resources" }}
    >
      <ArticleSections sections={explainer.sections} />

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
    </ArticleShell>
  );
}
