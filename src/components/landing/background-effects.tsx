"use client";

import { FloatingShapes, NeuralNetwork, ParticleSystem, HolographicGrid, FloatingDataParticles, FloatingOrb } from "./futuristic-effects";

export function BackgroundEffects() {
  return (
    <>
      <NeuralNetwork nodeCount={20} />
      <ParticleSystem count={60} color="129, 140, 248" speed={0.2} />
      <ParticleSystem count={25} color="168, 85, 247" speed={0.15} sizeRange={[2, 5]} />
      <FloatingShapes count={10} />
      <HolographicGrid />
      <FloatingDataParticles />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FloatingOrb color="from-primary-500/12 to-primary-700/5" size={600} className="-top-60 -left-60" blur="blur-[120px]" />
        <FloatingOrb color="from-secondary-500/12 to-secondary-700/5" size={700} className="top-1/3 -right-60" blur="blur-[140px]" animation="animate-orb-drift-2" />
        <FloatingOrb color="from-cyan-500/8 to-primary-500/5" size={500} className="-bottom-60 left-1/3" blur="blur-[100px]" delay="-8s" />
        <FloatingOrb color="from-amber-500/6 to-rose-500/4" size={400} className="top-2/3 left-1/4" blur="blur-[90px]" animation="animate-orb-drift-2" delay="-12s" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_60%)]" />

      <div className="grain-overlay" />
    </>
  );
}
