"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { TiltCard, HolographicBadge, ScanningBeam, FloatingOrb } from "./futuristic-effects";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Full assessment and basic report at no cost",
    features: ["Complete adaptive assessment", "Basic readiness report", "Radar chart visualization", "Top 3 weaknesses identified", "Progress tracking"],
    cta: "Start Free",
    href: "/auth/register",
    popular: false,
    icon: Shield,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Deep Report",
    price: 3000,
    description: "Complete diagnostic with AI-powered recommendations",
    features: ["Everything in Free", "20-section Deep Report", "AI-generated recommendations", "Daily practice plan", "PDF download", "Misconception analysis", "Growth projection", "Parent diagnostic report"],
    cta: "Get Deep Report",
    href: "/auth/register",
    popular: true,
    icon: Zap,
    gradient: "from-primary-500 to-secondary-500",
  },
  {
    name: "School Bulk",
    price: 150000,
    description: "Perfect for schools with multiple students",
    features: ["50 Deep Report credits", "School dashboard", "Teacher analytics", "Parent portal access", "Class comparison tools", "School quality report", "Bulk student management", "Priority support"],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    icon: Star,
    gradient: "from-amber-500 to-orange-500",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Holographic grid background */}
      <div className="data-grid pointer-events-none absolute inset-0 opacity-20" />

      <FloatingOrb color="from-primary-500/12 to-secondary-500/8" size={700} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" blur="blur-[150px]" animation="animate-glow-pulse" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <HolographicBadge text="Simple, Transparent Pricing" />
          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">Start Free. Upgrade When Ready.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            No hidden fees. No surprise charges. Just clear, affordable access to the world&apos;s most advanced learning diagnostic.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <TiltCard maxTilt={plan.popular ? 4 : 3} glare={true}>
                <div
                  className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                    plan.popular
                      ? "border-primary-500/30 bg-gradient-to-b from-slate-900 to-slate-900/80 shadow-2xl shadow-primary-500/10"
                      : "border-white/5 bg-slate-900/40 backdrop-blur-sm hover:border-white/10 hover:shadow-xl"
                  } holo-card scan-overlay`}
                >
                  <ScanningBeam />

                  {plan.popular && (
                    <>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/30 z-20 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </div>
                    </>
                  )}

                  {/* Hover glow */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/0 via-secondary-500/0 to-primary-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                    plan.popular ? "group-hover:from-primary-500/8 group-hover:via-secondary-500/8 group-hover:to-primary-500/8" : "group-hover:from-primary-500/3 group-hover:via-secondary-500/3 group-hover:to-primary-500/3"
                  }`} />

                  <div className="relative">
                    {/* Icon */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="mt-6 text-lg font-semibold text-white">{plan.name}</div>
                    <div className="mt-3">
                      <span className="text-5xl font-extrabold text-white">
                        {plan.price === 0 ? "Free" : formatNaira(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="ml-2 text-sm text-slate-500">one-time</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </span>
                          <span className="text-slate-300">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link href={plan.href}>
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          size="lg"
                          className={`w-full transition-all duration-300 ${
                            plan.popular
                              ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:scale-[1.02]"
                              : "border-white/10 text-white hover:bg-white/5 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
