"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function HolographicCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 3000;
          const steps = 80;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            const pct = Math.min(current / target, 1);
            setProgress(pct);
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div ref={ref} className="group relative flex flex-col items-center">
      {/* Animated glow ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-xl transition-all duration-700 group-hover:from-primary-500/25 group-hover:to-secondary-500/25 group-hover:blur-2xl" />
      </div>

      {/* Holographic ring */}
      <svg className="relative h-28 w-28 -rotate-90" viewBox="0 0 72 72">
        {/* Background ring */}
        <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor"
          className="text-slate-800" strokeWidth="1.5" />
        {/* Progress ring */}
        <circle cx="36" cy="36" r={radius} fill="none"
          stroke="currentColor"
          className="text-primary-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out", filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }}
        />
        {/* Glow accent ring */}
        <circle cx="36" cy="36" r={radius - 4} fill="none"
          stroke="currentColor"
          className="text-secondary-400"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.3}
          strokeDashoffset={offset + circumference * 0.1}
          style={{ opacity: 0.6, transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>

      {/* Count */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]">
          {count.toLocaleString()}{suffix}
        </span>
      </div>

      {/* Label */}
      <span className="mt-5 text-sm font-medium text-slate-500 transition-all duration-300 group-hover:text-slate-300 relative">
        {label}
        {isVisible && (
          <span className="absolute -bottom-[2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />
        )}
      </span>

      {/* Hover scan effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary-400/20 to-transparent animate-scan-line" />
      </div>
    </div>
  );
}

export function StatsCounter() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const stats = data ? [
    { label: "Assessments Completed", value: data.assessmentsCompleted || 0, suffix: "+" },
    { label: "Questions in Bank", value: data.totalQuestions || 0, suffix: "+" },
    { label: "Schools Using", value: data.schoolsUsing || 0, suffix: "+" },
    { label: "Deep Reports Generated", value: data.deepReportsGenerated || 0, suffix: "+" },
  ] : [];

  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-slate-900/50 py-16">
      {/* Grid overlay */}
      <div className="data-grid pointer-events-none absolute inset-0 opacity-20" />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-500/3 via-transparent to-secondary-500/3" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <HolographicCounter target={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
