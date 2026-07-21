"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function Counter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2500;
          const steps = 60;
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

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div ref={ref} className="group relative flex flex-col items-center">
      {/* Glow ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-xl transition-all duration-700 group-hover:from-primary-500/20 group-hover:to-secondary-500/20" />
      </div>

      {/* SVG circle */}
      <svg className="relative h-24 w-24 -rotate-90" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={radius} fill="none" stroke="currentColor"
          className="text-slate-800" strokeWidth="2" />
        <circle cx="34" cy="34" r={radius} fill="none"
          stroke="currentColor"
          className="text-primary-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.5s" }}
        />
      </svg>

      {/* Count */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <span className="text-2xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
          {count.toLocaleString()}{suffix}
        </span>
      </div>

      <span className="mt-4 text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-slate-300">
        {label}
      </span>
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
      {/* Subtle gradient overlay */}
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
              <Counter target={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
