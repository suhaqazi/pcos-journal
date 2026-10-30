import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";
import WhatsInsideSection from "@/components/landing/WhatsInsideSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <Hero />
      <FeatureSection />
      <WhatsInsideSection />
    </main>
  );
}
