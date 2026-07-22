"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, School, Users, BookOpen, Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TiltCard, HolographicBadge, FloatingOrb } from "./futuristic-effects";

const testimonials = [
  {
    quote: "Deep Check transformed how we understand student learning. The gap analysis is unlike anything we've seen in 20 years of education.",
    author: "Dr. Adebayo Ogunlesi",
    role: "Principal, Lagos International School",
    rating: 5,
  },
  {
    quote: "My son's math teacher was amazed at how precisely Deep Check identified his struggle with fractions — something we'd missed for two terms.",
    author: "Chioma Eze",
    role: "Parent, 2 children in primary school",
    rating: 5,
  },
  {
    quote: "The school deep report gave us actionable data on every department. We've already restructured our math curriculum based on the findings.",
    author: "Mr. Emeka Nwosu",
    role: "Head of Academics, Abuja Prep",
    rating: 5,
  },
  {
    quote: "As a teacher, I can finally see exactly what each student is missing — not just their score. This is the future of educational assessment.",
    author: "Funmi Adeyemi",
    role: "Mathematics Teacher, Ibadan",
    rating: 5,
  },
];

export function Testimonials() {
  const [data, setData] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => { fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {}); }, []);

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const items = [
    { icon: School, label: "Schools", value: data?.schoolsUsing || 0, suffix: "+" },
    { icon: Users, label: "Students Assessed", value: data?.totalUsers || 0, suffix: "+" },
    { icon: BookOpen, label: "Questions Delivered", value: data?.assessmentsCompleted || 0, suffix: "+" },
  ];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb color="from-primary-500/8 to-secondary-500/5" size={600} className="top-0 left-1/4 -translate-x-1/2 -translate-y-1/3" blur="blur-[150px]" />
        <FloatingOrb color="from-cyan-500/5 to-primary-500/3" size={500} className="bottom-0 right-1/4 translate-x-1/2 translate-y-1/3" blur="blur-[120px]" animation="animate-orb-drift-2" />
      </div>

      {/* Grid overlay */}
      <div className="data-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <HolographicBadge text="Platform Impact" />
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
            >
              <TiltCard maxTilt={4}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:shadow-xl holo-card">
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="relative mt-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 neon-glow">
                    {item.value > 0 ? `${item.value.toLocaleString()}${item.suffix}` : "\u2014"}
                  </div>
                  <div className="relative mt-1 text-sm text-slate-500">{item.label}</div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Testimonial carousel */}
        <div className="mt-16">
          <div className="relative mx-auto max-w-3xl">
            {/* Quote decoration */}
            <Quote className="absolute -top-6 -left-2 h-10 w-10 text-primary-400/20" />

            <div className="relative min-h-[260px] flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute w-full"
                >
                  <TiltCard maxTilt={3}>
                    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-primary-600/10 via-secondary-600/5 to-primary-600/10 p-8 text-center backdrop-blur-sm md:p-12 scan-overlay">
                      <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: testimonials[activeIndex].rating }, (_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xl font-medium leading-relaxed text-white md:text-2xl">
                        &ldquo;{testimonials[activeIndex].quote}&rdquo;
                      </p>
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-primary-300">{testimonials[activeIndex].author}</p>
                        <p className="text-xs text-slate-500">{testimonials[activeIndex].role}</p>
                      </div>

                      {/* Decorative dots */}
                      <div className="mt-6 flex items-center justify-center gap-2">
                        {testimonials.map((_, d) => (
                          <button
                            key={d}
                            onClick={() => { setDirection(d > activeIndex ? 1 : -1); setActiveIndex(d); }}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              d === activeIndex
                                ? "bg-primary-400 w-6 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                : "bg-primary-500/30 hover:bg-primary-500/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-xl text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-xl text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
