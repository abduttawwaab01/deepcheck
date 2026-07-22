import { HeroSection } from "@/components/landing/hero-section";
import { IntelligenceDemoBar } from "@/components/landing/intelligence-demo-bar";
import { StatsCounter } from "@/components/landing/stats-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DeepIntelligence } from "@/components/landing/deep-intelligence";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { BackgroundEffects } from "@/components/landing/background-effects";

export default function LandingPage() {
  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main>
        <HeroSection />
        <IntelligenceDemoBar />
        <StatsCounter />
        <HowItWorks />
        <DeepIntelligence />
        <Testimonials />
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
