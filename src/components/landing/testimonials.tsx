"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const testimonials = [
  {
    quote: "I never knew I had gaps in critical thinking. The radar chart showed me exactly what to work on. My scores improved 23% in one term!",
    name: "Adeola Samuel",
    role: "Primary 6 Student",
    school: "Gracefield International College",
    stars: 5,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    quote: "Our school's performance improved significantly after using Deep Check. The teacher effectiveness data helped us identify exactly where to focus.",
    name: "Mrs. Funmilayo Adebayo",
    role: "School Administrator",
    school: "Gracefield International College",
    stars: 5,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    quote: "Finally, I know exactly what my child needs. Not just a score but a complete roadmap with daily practice plans. Worth every naira.",
    name: "Mr. Samuel Adeyemi",
    role: "Parent",
    school: "Lagos",
    stars: 5,
    gradient: "from-primary-500 to-secondary-500",
  },
  {
    quote: "The misconception analysis is a game-changer. We now understand why students make specific errors, not just that they made errors.",
    name: "Dr. Chidi Okonkwo",
    role: "Principal",
    school: "Excel Comprehensive Academy",
    stars: 5,
    gradient: "from-amber-500 to-orange-500",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const t = testimonials[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="relative border-y border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/50 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-l from-primary-500/10 via-transparent to-secondary-500/10" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            What People Are Saying
          </div>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">Trusted by Thousands</h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">Join parents, students, and schools already using Deep Check</p>
        </motion.div>

        <div className="relative mt-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative"
            >
              <div className="glass-strong relative overflow-hidden rounded-2xl p-8 sm:p-10">
                <div className={`absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-br ${t.gradient} opacity-10`} />
                <div className="relative">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.1 }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-200">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}>
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-neutral-900 dark:text-white">{t.name}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{t.role}, {t.school}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prev} className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary-500" : "w-2 bg-neutral-300 dark:bg-neutral-700"}`}
                />
              ))}
            </div>
            <button onClick={next} className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
