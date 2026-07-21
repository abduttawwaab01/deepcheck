"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, School, Users, BookOpen, Quote } from "lucide-react";

export function Testimonials() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {}); }, []);

  const items = [
    { icon: School, label: "Schools", value: data?.schoolsUsing || 0, suffix: "+" },
    { icon: Users, label: "Students Assessed", value: data?.totalUsers || 0, suffix: "+" },
    { icon: BookOpen, label: "Questions Delivered", value: data?.assessmentsCompleted || 0, suffix: "+" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary-500/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Platform Impact
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">Making a Difference</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Deep Check helps schools, teachers, parents, and students identify and close learning gaps with precision.
          </p>
        </motion.div>

        {/* Impact stats */}
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:shadow-xl"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg transition-all duration-500 group-hover:scale-110">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div className="relative mt-4 text-3xl font-extrabold text-white">
                {item.value > 0 ? `${item.value.toLocaleString()}${item.suffix}` : "—"}
              </div>
              <div className="relative mt-1 text-sm text-slate-500">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="animated-border mt-14"
        >
          <div className="animated-border-content rounded-2xl border border-white/5 bg-gradient-to-br from-primary-600/10 via-secondary-600/5 to-primary-600/10 p-8 text-center backdrop-blur-sm md:p-12">
            <Quote className="mx-auto h-8 w-8 text-primary-400/40" />
            <p className="mt-4 text-xl font-medium leading-relaxed text-white md:text-2xl">
              &ldquo;Deep Check transformed how we understand student learning. The gap analysis is unlike anything we&apos;ve seen.&rdquo;
            </p>
            <p className="mt-6 text-sm text-slate-500">
              — Feedback from partner schools
            </p>

            {/* Decorative dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-primary-500/40"
                  style={{ opacity: 0.4 + d * 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
