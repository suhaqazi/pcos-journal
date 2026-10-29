import type { Metadata } from "next";
import ArticleShell, {
  ArticleSections,
} from "@/components/layout/ArticleShell";
import { LAST_UPDATED, PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy · Ask Orchid",
  description: "What Ask Orchid stores, who can see it, and how to delete it.",
};

export default function PrivacyPage() {
  return (
    <ArticleShell title="Privacy" eyebrow={`Last updated ${LAST_UPDATED}`}>
      <ArticleSections sections={PRIVACY} />
    </ArticleShell>
  );
}
