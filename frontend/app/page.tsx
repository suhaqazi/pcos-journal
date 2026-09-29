import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";
import WhatsInsideSection from "@/components/landing/WhatsInsideSection";

export default function Home() {
  return (
    <main
      style={{
        backgroundImage: "url('/wallpaper.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Hero />
      <FeatureSection />
      <WhatsInsideSection />
    </main>
  );
}
