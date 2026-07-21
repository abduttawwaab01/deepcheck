"use client";

import { useEffect, useRef, useCallback } from "react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouse = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const PARTICLE_COUNT = 65;
    const CONNECTION_DIST = 120;
    const MOUSE_RADIUS = 150;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const isDark = document.documentElement.classList.contains("dark");
      const particleColor = isDark ? "180, 180, 255" : "59, 130, 246";
      const lineColor = isDark ? "100, 100, 200" : "59, 130, 246";

      for (const p of particles) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${particleColor}, 0.15)`;
        ctx!.fill();

        for (let j = 0; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < CONNECTION_DIST) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(${lineColor}, ${(1 - dist2 / CONNECTION_DIST) * 0.06})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", handleMouse);
    resize();
    init();
    draw();

    const resizeHandler = () => { resize(); init(); };
    window.addEventListener("resize", resizeHandler);
    const darkObserver = new MutationObserver(() => {});
    darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resizeHandler);
      cancelAnimationFrame(animId);
      darkObserver.disconnect();
    };
  }, [handleMouse]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] animate-orb-drift rounded-full bg-gradient-to-br from-primary-500/10 to-primary-700/5 blur-[100px]" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] animate-orb-drift-2 rounded-full bg-gradient-to-br from-secondary-500/10 to-secondary-700/5 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] animate-orb-drift rounded-full bg-gradient-to-tr from-cyan-500/8 to-primary-500/5 blur-[80px]" style={{ animationDelay: "-5s" }} />
    </div>
  );
}

function GridLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.03] dark:opacity-[0.04]">
      <div
        className="absolute inset-0 animate-grid-scroll"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100, 100, 200, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 200, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function ScanLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.015]">
      <div className="absolute h-[1px] w-full animate-scan-line bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
    </div>
  );
}

export function BackgroundEffects() {
  return (
    <>
      <ParticleCanvas />
      <FloatingOrbs />
      <GridLines />
      <ScanLine />
      <div className="grain-overlay" />
    </>
  );
}
