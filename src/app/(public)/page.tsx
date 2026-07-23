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
import { SectionErrorBoundary } from "@/components/landing/section-error-boundary";

export default function LandingPage() {
  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main>
        <SectionErrorBoundary name="HeroSection">
          <HeroSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="IntelligenceDemoBar">
          <IntelligenceDemoBar />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="StatsCounter">
          <StatsCounter />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="HowItWorks">
          <HowItWorks />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="DeepIntelligence">
          <DeepIntelligence />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="Testimonials">
          <Testimonials />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="PricingSection">
          <PricingSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary name="FAQ">
          <FAQ />
        </SectionErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
