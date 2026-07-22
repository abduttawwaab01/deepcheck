"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ClipboardCheck, BarChart3, Target, Sparkles, ArrowRight, Zap } from "lucide-react";
import { HolographicBadge, TiltCard, ScanningBeam } from "./futuristic-effects";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Adaptive Assessment",
    description: "35 questions that evolve in real-time using IRT & Bayesian Knowledge Tracing. No studying required.",
    gradient: "from-primary-500 to-primary-600",
    stats: "~30 min",
    glow: "group-hover:shadow-primary-500/20",
    particles: "bg-primary-400",
    details: ["Real-time difficulty adjustment", "Misconception detection", "Response time analysis"],
  },
  {
    icon: BarChart3,
    title: "Deep Diagnostic",
    description: "20-section AI-powered report with radar charts, heatmaps, concept maps, and cognitive profiling.",
    gradient: "from-secondary-500 to-secondary-600",
    stats: "20-section report",
    glow: "group-hover:shadow-secondary-500/20",
    particles: "bg-secondary-400",
    details: ["IRT-based theta estimation", "Bloom's taxonomy analysis", "Neural network recommendations"],
  },
  {
    icon: Target,
    title: "Personalized Plan",
    description: "AI-generated daily, weekly, and monthly practice plans targeting exactly the gaps in understanding.",
    gradient: "from-emerald-500 to-emerald-600",
    stats: "AI-driven plan",
    glow: "group-hover:shadow-emerald-500/20",
    particles: "bg-emerald-400",
    details: ["Spaced repetition scheduling", "Adaptive learning path", "Progress tracking dashboard"],
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-secondary-500/5 blur-[150px]" />

      {/* Central progress line */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{
            scaleY: lineScale,
            opacity: lineOpacity,
            transformOrigin: "top",
            background: "linear-gradient(to bottom, rgba(59,130,246,0.8), rgba(168,85,247,0.8), rgba(59,130,246,0.8))",
            boxShadow: "0 0 20px rgba(59,130,246,0.3), 0 0 40px rgba(59,130,246,0.1)",
          }}
        />
        {/* Floating particles along line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          style={{ top: useTransform(scrollYProgress, [0, 1], ["5%", "95%"]) }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <HolographicBadge text="Simple 3-Step Process" />
          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Three steps powered by AI and cognitive science to uncover every learning gap
          </p>
        </motion.div>

        <div className="relative mt-20 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <TiltCard maxTilt={5} glare={true}>
                <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${step.glow} holo-card scan-overlay`}
                  style={{ minHeight: "380px" }}
                >
                  <ScanningBeam />
                  <div className="relative">
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-primary-500/30 bg-slate-900 text-xs font-bold text-primary-400 shadow-lg">
                      {i + 1}
                    </div>

                    {/* Icon with ring */}
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40 group-hover:blur-2xl`} />
                      <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      {/* Orbiting dot */}
                      <div className="absolute inset-0 rounded-2xl border border-white/5 animate-spin-slow"
                        style={{ animationDuration: "8s" }}
                      >
                        <div className={`absolute -top-1 left-1/2 h-2 w-2 rounded-full ${step.particles} shadow-[0_0_8px_rgba(59,130,246,0.5)]`} />
                      </div>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>

                    {/* Detail bullets */}
                    <div className="mt-6 space-y-2 text-left">
                      {step.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-white/[0.02] px-3 py-2">
                          <Zap className="h-3 w-3 text-primary-400 shrink-0" />
                          <span className="text-xs text-slate-500">{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-500 backdrop-blur-sm">
                      {step.stats}
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="flex items-center gap-1">
                    <ArrowRight className="h-5 w-5 text-primary-400/40 animate-pulse" />
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
