import type { Metadata } from "next";
import ArticleShell, {
  ArticleSections,
} from "@/components/layout/ArticleShell";
import { LAST_UPDATED, TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions · Ask Orchid",
  description: "The plain-language terms for using Ask Orchid.",
};

export default function TermsPage() {
  return (
    <ArticleShell
      title="Terms & Conditions"
      eyebrow={`Last updated ${LAST_UPDATED}`}
    >
      <ArticleSections sections={TERMS} />
    </ArticleShell>
  );
}
