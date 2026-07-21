"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Full assessment and basic report at no cost",
    features: ["Complete adaptive assessment", "Basic readiness report", "Radar chart visualization", "Top 3 weaknesses identified", "Progress tracking"],
    cta: "Start Free",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Deep Report",
    price: 3000,
    description: "Complete diagnostic with AI-powered recommendations",
    features: ["Everything in Free", "20-section Deep Report", "AI-generated recommendations", "Daily practice plan", "PDF download", "Misconception analysis", "Growth projection", "Parent diagnostic report"],
    cta: "Get Deep Report",
    href: "/auth/register",
    popular: true,
  },
  {
    name: "School Bulk",
    price: 150000,
    description: "Perfect for schools with multiple students",
    features: ["50 Deep Report credits", "School dashboard", "Teacher analytics", "Parent portal access", "Class comparison tools", "School quality report", "Bulk student management", "Priority support"],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">Start Free. Upgrade When Ready.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            No hidden fees. No surprise charges. Just clear, affordable access to the world&apos;s most advanced learning diagnostic.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular
                    ? "animated-border border-primary-500/20 bg-gradient-to-b from-slate-900 to-slate-900/80 shadow-xl shadow-primary-500/10"
                    : "border-white/5 bg-slate-900/40 backdrop-blur-sm hover:border-white/10 hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="animated-border-content">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-1 text-xs font-semibold text-white shadow-lg shadow-primary-500/30">
                        Most Popular
                      </div>
                    </div>
                  </>
                )}

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/0 via-secondary-500/0 to-primary-500/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-500/3 group-hover:via-secondary-500/3 group-hover:to-primary-500/3 group-hover:opacity-100" />

                <div className="relative">
                  <div className="text-lg font-semibold text-white">{plan.name}</div>
                  <div className="mt-4">
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
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
                            : "border-white/10 text-white hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
