"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/charts/radar-chart";
import { ArrowRight, ChevronDown, Sparkles, Play } from "lucide-react";

export function HeroSection() {
  const [data, setData] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const schoolCount = data?.schoolsUsing || 0;
  const userCount = data?.totalUsers || 0;

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Dynamic gradient that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(59,130,246,0.12), transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="group inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm transition-all duration-500 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
            </span>
            {schoolCount > 0
              ? `Trusted by ${schoolCount}+ schools across Nigeria`
              : "Trusted by schools across Nigeria"}
          </div>
        </motion.div>

        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Discover What Your Child</span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 bg-clip-text text-transparent animate-gradient-shift">
                Doesn&apos;t Know
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              The world&apos;s most advanced learning diagnostic intelligence platform.
              We uncover every hidden gap, misconception, and cognitive weakness
              before your child moves to the next class.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-6 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-500 hover:shadow-primary-500/40 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 bg-white/5 px-8 py-6 text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 flex items-center gap-5"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-800"
                  >
                    <div className={`h-full w-full bg-gradient-to-br ${
                      i === 1 ? "from-pink-400 to-pink-600" :
                      i === 2 ? "from-blue-400 to-blue-600" :
                      i === 3 ? "from-amber-400 to-amber-600" :
                      "from-emerald-400 to-emerald-600"
                    }`} />
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-semibold text-white">
                  {userCount > 0
                    ? `${userCount >= 1000 ? `${Math.round(userCount / 1000)}K+` : `${userCount}+`}`
                    : "Thousands of"}
                </span>{" "}
                parents already using Deep Check
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Diagnostic Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-primary-500/20 opacity-50 blur-2xl" />

            <div
              ref={cardRef}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary-500/10"
              style={{
                transform: `perspective(1000px) rotateX(${(mousePos.y - 0.5) * -4}deg) rotateY(${(mousePos.x - 0.5) * 4}deg)`,
              }}
            >
              {/* Subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Live Diagnostic Preview</div>
                    <div className="text-xs text-slate-500">Real-time analysis simulation</div>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  AI-Powered
                </div>
              </div>

              {/* Radar Chart */}
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent" />
                <RadarChart
                  data={[
                    { dimension: "Math", student: 55, peerAverage: 62 },
                    { dimension: "English", student: 78, peerAverage: 70 },
                    { dimension: "Science", student: 61, peerAverage: 58 },
                    { dimension: "Reasoning", student: 42, peerAverage: 50 },
                    { dimension: "Critical Thinking", student: 38, peerAverage: 45 },
                  ]}
                  size={250}
                />
              </div>

              {/* Stats grid */}
              <div className="relative mb-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-primary-400">62</span>
                    <span className="text-sm font-medium text-primary-400/60">%</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Overall Readiness</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-rose-400">3</span>
                    <span className="text-sm font-medium text-rose-400/60">gaps</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Critical Gaps Found</div>
                </div>
              </div>

              {/* Gap items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-sm text-slate-300">Logical Deduction</span>
                  <span className="text-sm font-semibold text-rose-400">28%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-3 backdrop-blur-sm">
                  <span className="text-sm text-slate-300">Fraction Operations</span>
                  <span className="text-sm font-semibold text-amber-400">34%</span>
                </div>
              </div>

              {/* Subtle scan line */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute h-[1px] w-full animate-scan-line bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-3 -right-3 z-20"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                <div className="text-center">
                  <div className="text-xs font-bold text-primary-400">AI</div>
                  <div className="text-[10px] text-slate-500">Engine</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-slate-600"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
