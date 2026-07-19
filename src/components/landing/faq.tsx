"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  { q: "What is Deep Check?", a: "Deep Check is a learning diagnostic intelligence platform that identifies every learning gap, misconception, and cognitive weakness before a learner progresses to the next educational level. It is not an exam or quiz platform." },
  { q: "How is this different from regular exams?", a: "Regular exams measure what a student knows. Deep Check measures what a student is missing. We use adaptive testing (CAT), Item Response Theory (IRT), and Bayesian Knowledge Tracing (BKT) to detect gaps that traditional tests miss." },
  { q: "How long does the assessment take?", a: "The adaptive assessment takes 25-45 minutes depending on the student's responses. The system adapts in real-time, so students who are struggling may receive more questions to pinpoint exact gaps." },
  { q: "Can my school use Deep Check?", a: "Yes. Schools can register for a bulk plan starting at 50 credits. School administrators get access to class analytics, teacher effectiveness data, and the School Quality Diagnostic Report." },
  { q: "Is my child's data safe?", a: "Absolutely. We encrypt all data in transit and at rest. We never share or sell student data. Parental consent is required for children under 13. We comply with NDPR and GDPR standards." },
  { q: "What if we don't have internet at home?", a: "The assessment can be completed at school, cyber cafe, or any location with internet access. We are developing offline-capable features and USSD-based result delivery for areas with limited connectivity." },
  { q: "How much does the Deep Report cost?", a: "The Deep Report costs 3,000 Naira (one-time payment per assessment). The basic report is always free. School bulk plans bring the cost down to as little as 1,750 Naira per report." },
  { q: "Can parents track multiple children?", a: "Yes. Parents can link unlimited children to one account and view independent dashboards, reports, and progress tracking for each child." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            Got Questions?
          </div>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white lg:text-4xl">Frequently Asked Questions</h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <span className="font-medium text-neutral-900 dark:text-white">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="border-t border-neutral-100 px-6 py-4 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
