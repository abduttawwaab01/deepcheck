"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
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
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-transparent to-neutral-50 dark:from-neutral-900/50 dark:via-transparent dark:to-neutral-900/50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">Start Free. Upgrade When Ready.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">No hidden fees. No surprise charges. Just clear, affordable access to the world's most advanced learning diagnostic.</p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-primary-500 bg-gradient-to-b from-primary-50 to-white shadow-lg dark:from-primary-950/50 dark:to-neutral-950"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="text-lg font-semibold text-neutral-900 dark:text-white">{plan.name}</div>
              <div className="mt-3">
                <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">
                  {plan.price === 0 ? "Free" : formatNaira(plan.price)}
                </span>
                {plan.price > 0 && <span className="ml-1 text-sm text-neutral-500 dark:text-neutral-400">one-time</span>}
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-neutral-700 dark:text-neutral-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="mt-8 block">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
