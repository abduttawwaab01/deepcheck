"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/charts/radar-chart";
import { ArrowRight, Play, Sparkles, Brain, Zap, Activity } from "lucide-react";
import { TypewriterText, ScanningBeam, TiltCard, FloatingOrb, DataEqualizer } from "./futuristic-effects";

export function HeroSection() {
  const [data, setData] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      setGlowPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const schoolCount = data?.schoolsUsing || 0;
  const userCount = data?.totalUsers || 0;

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Dynamic cursor gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(800px circle at ${glowPos.x}px ${glowPos.y}px, rgba(59,130,246,0.12), rgba(168,85,247,0.06) 40%, transparent 60%)`,
        }}
      />

      {/* Top gradient sweep */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary-500/5 via-secondary-500/3 to-transparent" />

      {/* Central glow */}
      <FloatingOrb color="from-primary-500/15 to-secondary-500/10" size={800} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" blur="blur-[150px]" animation="animate-glow-pulse" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">

        {/* Holographic badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="group inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm animate-hologram transition-all duration-500 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10">
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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                <Zap className="h-3 w-3 text-emerald-400" />
              </span>
              <span className="text-xs font-medium tracking-widest text-emerald-400/80 uppercase">Next-Gen Learning Intelligence</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-white">Discover What</span>
              <br />
              <span className="bg-gradient-to-r from-primary-300 via-secondary-300 to-primary-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                Your Child
              </span>
              <br />
              <TypewriterText
                texts={["Doesn't Know", "Is Missing", "Needs Most"]}
                speed={60}
                delay={2500}
                className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift"
              />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              The world&apos;s most advanced learning diagnostic intelligence platform.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"> AI-powered gap analysis</span> that uncovers every hidden misconception.
            </p>

            {/* Animated stats row */}
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <DataEqualizer bars={6} className="h-6" />
                <span className="text-xs text-slate-600">Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-[1px]">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="h-3 w-[2px] bg-primary-500/30 rounded-full animate-neural-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  ))}
                </div>
                <span className="text-xs text-slate-600">Adaptive</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 px-8 py-6 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-500 hover:shadow-primary-500/40 hover:scale-105 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-beam-sweep" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 bg-white/5 px-8 py-6 text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/20 group"
              >
                <Play className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </Button>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 flex items-center gap-5"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-800 ring-2 ring-slate-950 transition-transform duration-300 hover:scale-110 hover:z-10"
                  >
                    <div className={`h-full w-full bg-gradient-to-br ${
                      i === 1 ? "from-pink-400 to-pink-600" :
                      i === 2 ? "from-blue-400 to-blue-600" :
                      i === 3 ? "from-amber-400 to-amber-600" :
                      "from-emerald-400 to-emerald-600"
                    }`} />
                  </div>
                ))}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-primary-500/40 text-[10px] font-bold text-primary-400 bg-slate-950">
                  +
                </div>
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-semibold text-white neon-glow">
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
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {/* Orbiting rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[340px] w-[340px] rounded-full border border-primary-500/10 animate-orbit"
                style={{ "--orbit-radius": "170px" } as React.CSSProperties}
              >
                <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-primary-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
              <div className="absolute h-[400px] w-[400px] rounded-full border border-secondary-500/10 animate-orbit-reverse"
                style={{ "--orbit-radius": "200px" } as React.CSSProperties}
              >
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 rounded-full bg-secondary-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>
              <div className="absolute h-[280px] w-[280px] rounded-full border border-cyan-500/8 animate-orbit"
                style={{ "--orbit-radius": "140px", animationDuration: "18s" } as React.CSSProperties}
              >
                <div className="absolute top-1/2 -right-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
            </div>

            {/* 3D Tilt Card */}
            <TiltCard maxTilt={6} glare={true}>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary-500/10 holo-card scan-overlay">
                <ScanningBeam className="rounded-2xl" />

                {/* Header */}
                <div className="relative mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                      <Brain className="h-4 w-4 text-white" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[6px] font-bold text-white shadow-lg">AI</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Live Diagnostic Preview</div>
                      <div className="text-xs text-slate-500">Real-time neural analysis</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-[2px]">
                      {[0,1,2].map(i => (
                        <div key={i} className="h-3 w-[2px] bg-emerald-400/60 rounded-full animate-equalizer" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Live
                    </div>
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
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">62</span>
                      <span className="text-sm font-medium text-primary-400/60">%</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Overall Readiness</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-300">3</span>
                      <span className="text-sm font-medium text-rose-400/60">gaps</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Critical Gaps Found</div>
                  </div>
                </div>

                {/* Gap items */}
                <div className="space-y-2">
                  {[
                    { name: "Logical Deduction", score: "28%", color: "rose" },
                    { name: "Fraction Operations", score: "34%", color: "amber" },
                  ].map((item, i) => (
                    <div
                      key={item.name}
                      className="group/item relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05]"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-${item.color}-500/50 transition-all duration-300 group-hover/item:w-[4px]`}
                        style={{ backgroundColor: i === 0 ? "rgba(244,63,94,0.5)" : "rgba(245,158,11,0.5)" }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.name}</span>
                        <span className="text-sm font-semibold" style={{ color: i === 0 ? "rgba(251,113,133,1)" : "rgba(251,191,36,1)" }}>{item.score}</span>
                      </div>
                      <div className="mt-1.5 h-[2px] w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: item.score,
                            backgroundColor: i === 0 ? "rgba(244,63,94,0.4)" : "rgba(245,158,11,0.4)",
                            boxShadow: i === 0 ? "0 0 6px rgba(244,63,94,0.3)" : "0 0 6px rgba(245,158,11,0.3)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Data activity indicator */}
                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600">
                  <Activity className="h-3 w-3 text-primary-400 animate-neural-pulse" />
                  <span>Neural analysis active</span>
                  <span className="ml-auto flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="h-1 w-1 rounded-full bg-primary-400/40" style={{ animation: `neural-pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 z-20"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl animate-hologram">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-sm" />
                <div className="relative text-center">
                  <Brain className="mx-auto h-6 w-6 text-primary-400" />
                  <div className="text-[9px] font-bold text-primary-300">AI</div>
                  <div className="text-[8px] text-slate-500">Engine</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-3 -left-3 z-20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex gap-1 mb-1">
              {[0,1,2].map(i => (
                <div key={i} className="h-1 w-1 rounded-full bg-primary-400/30 animate-neural-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
            <span className="text-[10px] font-medium tracking-[0.3em] text-slate-600 uppercase">Explore</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
