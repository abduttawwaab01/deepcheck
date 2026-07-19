import Link from "next/link";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsCounter } from "@/components/landing/stats-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DeepIntelligence } from "@/components/landing/deep-intelligence";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
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
