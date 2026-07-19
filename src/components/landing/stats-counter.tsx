"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Assessments Completed", value: 50239, suffix: "+" },
  { label: "Learning Gaps Found", value: 1200000, suffix: "+" },
  { label: "Schools Using", value: 534, suffix: "+" },
  { label: "Deep Reports Generated", value: 45128, suffix: "+" },
];

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

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <svg className="absolute h-20 w-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="3" />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke="currentColor"
          className="text-primary-500 dark:text-primary-400"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>
      <div className="relative z-10 flex h-20 w-20 items-center justify-center">
        <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
          {count.toLocaleString()}{suffix}
        </span>
      </div>
      <span className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">{label}</span>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="relative border-y border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Counter target={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
