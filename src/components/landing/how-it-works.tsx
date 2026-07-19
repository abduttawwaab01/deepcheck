"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, Target, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Take Adaptive Assessment",
    description: "Answer 30-50 smart questions that adapt to your child's ability level. No studying required — just honest answers.",
    gradient: "from-primary-500 to-primary-600",
    stats: "~30 min",
  },
  {
    icon: BarChart3,
    title: "Receive Deep Diagnostic",
    description: "Get a 20-section AI-powered report with radar charts, heatmaps, gap analysis, and personalized insights.",
    gradient: "from-secondary-500 to-secondary-600",
    stats: "20-section report",
  },
  {
    icon: Target,
    title: "Follow Personalized Plan",
    description: "Receive daily, weekly, and monthly practice plans designed to fix exactly what your child is missing.",
    gradient: "from-success to-emerald-600",
    stats: "AI-driven plan",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            Simple 3-Step Process
          </div>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            Three simple steps to uncover your child's learning gaps and build a personalized path to mastery
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
              className="group perspective-[1000px]"
            >
              <div
                className="relative rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-500 hover:shadow-xl dark:bg-neutral-900 dark:hover:bg-neutral-800/90"
                style={{ transformStyle: "preserve-3d" }}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  el.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
                }}
              >
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <div className="mt-2 flex items-center justify-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {i + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.description}</p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {step.stats}
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400 dark:bg-primary-500"
                        style={{ animationDelay: `${d * 0.3}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
