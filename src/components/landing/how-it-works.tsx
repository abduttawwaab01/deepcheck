"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ClipboardCheck, BarChart3, Target, Sparkles } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Take Adaptive Assessment",
    description: "Answer 30-50 smart questions that adapt to your child's ability level. No studying required — just honest answers.",
    gradient: "from-primary-500 to-primary-600",
    stats: "~30 min",
    glow: "group-hover:shadow-primary-500/20",
  },
  {
    icon: BarChart3,
    title: "Receive Deep Diagnostic",
    description: "Get a 20-section AI-powered report with radar charts, heatmaps, gap analysis, and personalized insights.",
    gradient: "from-secondary-500 to-secondary-600",
    stats: "20-section report",
    glow: "group-hover:shadow-secondary-500/20",
  },
  {
    icon: Target,
    title: "Follow Personalized Plan",
    description: "Receive daily, weekly, and monthly practice plans designed to fix exactly what your child is missing.",
    gradient: "from-emerald-500 to-emerald-600",
    stats: "AI-driven plan",
    glow: "group-hover:shadow-emerald-500/20",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Vertical connecting line */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-500 via-secondary-500 to-primary-500"
          style={{ scaleY: lineScale, transformOrigin: "top" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Simple 3-Step Process
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Three simple steps to uncover your child&apos;s learning gaps and build a personalized path to mastery
          </p>
        </motion.div>

        <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* 3D Tilt Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-center backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${step.glow}`}
                style={{ transformStyle: "preserve-3d" }}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  el.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
                }}
              >
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -inset-20 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Icon */}
                <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Step number badge */}
                <div className="mt-4 flex items-center justify-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary-500/30 bg-primary-500/10 text-xs font-bold text-primary-400 backdrop-blur-sm">
                    {i + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>

                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-500 backdrop-blur-sm">
                  {step.stats}
                </div>

                {/* Border glow on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: "inset 0 0 30px rgba(59,130,246,0.05)",
                  }}
                />
              </div>

              {/* Connector line between cards */}
              {i < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500/60"
                        style={{ animationDelay: `${d * 0.3}s`, animationDuration: "2s" }}
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
