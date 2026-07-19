"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/charts/radar-chart";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-950/20 dark:to-neutral-950" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse-slow" />
              Trusted by 500+ schools across Nigeria
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
              Discover What Your Child{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Doesn't Know
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              The world's most advanced learning diagnostic intelligence platform. 
              We uncover every hidden gap, misconception, and cognitive weakness 
              before your child moves to the next class.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Assessment
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="dark:text-neutral-300 dark:border-neutral-700">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-secondary-400 dark:border-neutral-900" />
                ))}
              </div>
              <span>Join <strong className="text-neutral-900 dark:text-white">12,000+</strong> parents already using Deep Check</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-strong rounded-2xl p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Live Diagnostic Preview</span>
                <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">AI-Powered</span>
              </div>

              <div className="flex items-center justify-center">
                <RadarChart
                  data={[
                    { dimension: "Math", student: 55, peerAverage: 62 },
                    { dimension: "English", student: 78, peerAverage: 70 },
                    { dimension: "Science", student: 61, peerAverage: 58 },
                    { dimension: "Reasoning", student: 42, peerAverage: 50 },
                    { dimension: "Critical Thinking", student: 38, peerAverage: 45 },
                  ]}
                  size={280}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/80">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">62%</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Overall Readiness</div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/80">
                  <div className="text-2xl font-bold text-error">3</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Critical Gaps</div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-error/5 px-3 py-2">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Logical Deduction</span>
                  <span className="text-sm font-semibold text-error">28%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-warning/5 px-3 py-2">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Fraction Operations</span>
                  <span className="text-sm font-semibold text-warning">34%</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 p-0.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white text-center text-xs font-bold text-secondary-600 dark:bg-neutral-900 dark:text-secondary-400">
                AI <br />Powered
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
