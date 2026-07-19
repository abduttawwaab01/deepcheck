"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I never knew I had gaps in critical thinking. The radar chart showed me exactly what to work on. My scores improved 23% in one term!",
    name: "Adeola Samuel",
    role: "Primary 6 Student",
    school: "Gracefield International College",
    stars: 5,
  },
  {
    quote: "Our school's performance improved significantly after using Deep Check. The teacher effectiveness data helped us identify exactly where to focus.",
    name: "Mrs. Funmilayo Adebayo",
    role: "School Administrator",
    school: "Gracefield International College",
    stars: 5,
  },
  {
    quote: "Finally, I know exactly what my child needs. Not just a score but a complete roadmap with daily practice plans. Worth every naira.",
    name: "Mr. Samuel Adeyemi",
    role: "Parent",
    school: "Lagos",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-neutral-50 py-20 dark:bg-neutral-900/50 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">What People Are Saying</h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">Join thousands of parents, students, and schools already using Deep Check</p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-sm font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role}, {t.school}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
