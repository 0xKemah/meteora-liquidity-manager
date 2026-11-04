import { FeatureSection } from "@/components/feature-section";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeatureSection />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  );
}
