import Hero from "@/components/landing/Hero";
import FeatureSection from "@/components/landing/FeatureSection";

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
    </main>
  );
}
