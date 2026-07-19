"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Target, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Take Adaptive Assessment",
    description: "Answer 30-50 smart questions that adapt to your child's ability level. No studying required — just honest answers.",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    icon: BarChart3,
    title: "Receive Deep Diagnostic",
    description: "Get a 20-section AI-powered report with radar charts, heatmaps, gap analysis, and personalized insights.",
    gradient: "from-secondary-500 to-secondary-600",
  },
  {
    icon: Target,
    title: "Follow Personalized Plan",
    description: "Receive daily, weekly, and monthly practice plans designed to fix exactly what your child is missing.",
    gradient: "from-success to-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
            Three simple steps to uncover your child's learning gaps
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <div className="mt-2 flex items-center justify-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {i + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.description}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                  <ArrowRight className="h-6 w-6 text-neutral-300 dark:text-neutral-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
