"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ─── 3D Floating Geometric Shapes ───────────────────────────

const shapeVariants = [
  "cube", "pyramid", "ring", "sphere", "torus", "octahedron"
] as const;

const colors = [
  "rgba(59,130,246,", "rgba(168,85,247,", "rgba(34,211,238,", "rgba(250,204,21,"
];

export function FloatingShapes({ count = 8 }: { count?: number }) {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    type: shapeVariants[i % shapeVariants.length],
    size: 20 + Math.random() * 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 200 - 100,
    color: colors[i % colors.length],
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    rotationSpeed: 0.5 + Math.random() * 1.5,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {shapes.map((s) => (
        <div
          key={s.id}
          className="absolute animate-float-3d"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            perspective: "800px",
          }}
        >
          <div
            className="animate-spin-3d"
            style={{
              animationDuration: `${20 / s.rotationSpeed}s`,
              width: s.size,
              height: s.size,
            }}
          >
            {s.type === "cube" && (
              <div
                className="h-full w-full"
                style={{
                  border: `1.5px solid ${s.color}0.3)`,
                  borderRadius: "4px",
                  background: `${s.color}0.05)`,
                  boxShadow: `0 0 20px ${s.color}0.1), inset 0 0 20px ${s.color}0.05)`,
                  transform: `rotateX(${s.id * 15}deg) rotateY(${s.id * 25}deg)`,
                }}
              />
            )}
            {s.type === "pyramid" && (
              <div
                className="h-full w-full"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  border: `1.5px solid ${s.color}0.3)`,
                  background: `${s.color}0.05)`,
                  boxShadow: `0 0 20px ${s.color}0.1)`,
                }}
              />
            )}
            {s.type === "ring" && (
              <div
                className="h-full w-full rounded-full"
                style={{
                  border: `2px solid ${s.color}0.25)`,
                  boxShadow: `0 0 15px ${s.color}0.1), inset 0 0 15px ${s.color}0.05)`,
                  transform: `rotateX(60deg) rotateY(${s.id * 30}deg)`,
                }}
              />
            )}
            {s.type === "sphere" && (
              <div
                className="h-full w-full rounded-full animate-pulse-ring"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${s.color}0.2), ${s.color}0.05))`,
                  border: `1px solid ${s.color}0.2)`,
                  boxShadow: `0 0 30px ${s.color}0.15)`,
                }}
              />
            )}
            {s.type === "torus" && (
              <div
                className="h-full w-full rounded-full"
                style={{
                  border: `3px solid ${s.color}0.2)`,
                  background: `${s.color}0.03)`,
                  boxShadow: `0 0 25px ${s.color}0.1)`,
                  transform: `scale(0.7) rotateX(45deg) rotateY(${s.id * 20}deg)`,
                }}
              />
            )}
            {s.type === "octahedron" && (
              <div
                className="h-full w-full"
                style={{
                  clipPath: "polygon(50% 0%, 80% 25%, 80% 75%, 50% 100%, 20% 75%, 20% 25%)",
                  border: `1.5px solid ${s.color}0.3)`,
                  background: `${s.color}0.05)`,
                  boxShadow: `0 0 20px ${s.color}0.1)`,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Neural Network Visualization ───────────────────────────

export function NeuralNetwork({ nodeCount = 16 }: { nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; phase: number }[] = [];
    const layers = 4;
    const nodesPerLayer = Math.ceil(nodeCount / layers);

    for (let l = 0; l < layers; l++) {
      const count = l === 0 || l === layers - 1 ? 3 : nodesPerLayer;
      for (let n = 0; n < count; n++) {
        nodes.push({
          x: 0, y: 0, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function layout() {
      const w = canvas!.width;
      const h = canvas!.height;
      let idx = 0;
      for (let l = 0; l < layers; l++) {
        const count = l === 0 || l === layers - 1 ? 3 : nodesPerLayer;
        const layerX = (w / (layers + 1)) * (l + 1);
        for (let n = 0; n < count && idx < nodes.length; n++) {
          nodes[idx].x = layerX + (Math.random() - 0.5) * 30;
          nodes[idx].y = (h / (count + 1)) * (n + 1) + (Math.random() - 0.5) * 20;
          idx++;
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const t = Date.now() / 1000;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250 && Math.abs(i - j) < 10) {
            const opacity = 0.15 * (1 - dist / 250) * (0.5 + 0.5 * Math.sin(t + nodes[i].phase));
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }

      // Draw nodes with pulse
      for (const node of nodes) {
        const pulse = 0.4 + 0.6 * Math.sin(t * 0.8 + node.phase);
        const glow = 15 * pulse;

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(129, 140, 248, ${0.4 + 0.6 * pulse})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, glow, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(99, 102, 241, ${0.06 * pulse})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    layout();
    draw();
    window.addEventListener("resize", () => { resize(); layout(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.5 }}
    />
  );
}

// ─── Advanced Particle System ───────────────────────────────

interface ParticleSystemProps {
  count?: number;
  color?: string;
  speed?: number;
  interactive?: boolean;
  sizeRange?: [number, number];
}

export function ParticleSystem({
  count = 80,
  color = "99, 102, 241",
  speed = 0.3,
  interactive = true,
  sizeRange = [1, 3],
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const handleMouse = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; pulse: number; phase: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed - 0.1,
          size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
          alpha: 0.1 + Math.random() * 0.5,
          pulse: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const t = Date.now() / 1000;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas!.width + 10;
        if (p.x > canvas!.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas!.height + 10;
        if (p.y > canvas!.height + 10) p.y = -10;

        if (interactive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx -= (dx / dist) * force * 0.05;
            p.vy -= (dy / dist) * force * 0.05;
            const glowSize = p.size + 6 * force;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${color}, ${0.08 * force})`;
            ctx!.fill();
          }
        }

        const alphaPulse = p.alpha * (0.7 + 0.3 * Math.sin(t * p.pulse + p.phase));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color}, ${alphaPulse})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    if (interactive) window.addEventListener("mousemove", handleMouse);
    resize();
    init();
    draw();
    const resizeHandler = () => { resize(); init(); };
    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(animId);
      if (interactive) window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [count, color, speed, interactive, sizeRange, handleMouse]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

// ─── Holographic Grid ───────────────────────────────────────

export function HolographicGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `perspective(800px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateZ(-20px)`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={gridRef}
      className="pointer-events-none fixed inset-0 z-0 transition-transform duration-200 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100, 100, 200, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 200, 0.6) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          animation: "grid-scroll 40s linear infinite",
          transform: "rotateX(60deg) translateY(-50%)",
          transformOrigin: "50% 0",
          height: "200%",
        }}
      />
    </div>
  );
}

// ─── Floating Data Particles ────────────────────────────────

export function FloatingDataParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const symbols = ["∑", "∫", "π", "∞", "Δ", "√", "θ", "λ", "σ", "μ", "φ", "ω", "∂", "∏", "∇", "∈", "⊂", "⊆", "∪", "∩"];
    const items: {
      x: number; y: number; symbol: string; size: number; alpha: number;
      speed: number; phase: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      items.length = 0;
      for (let i = 0; i < 30; i++) {
        items.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: 8 + Math.random() * 14,
          alpha: 0.03 + Math.random() * 0.06,
          speed: 0.1 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const t = Date.now() / 1000;

      for (const item of items) {
        item.y -= item.speed;
        item.x += Math.sin(t * 0.5 + item.phase) * 0.3;

        if (item.y < -20) {
          item.y = canvas!.height + 20;
          item.x = Math.random() * canvas!.width;
        }

        ctx!.font = `${item.size}px "JetBrains Mono", monospace`;
        ctx!.fillStyle = `rgba(99, 102, 241, ${item.alpha * (0.5 + 0.5 * Math.sin(t + item.phase))})`;
        ctx!.fillText(item.symbol, item.x, item.y);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", () => { resize(); init(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

// ─── 3D Tilt Card Wrapper ───────────────────────────────────

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;

    if (glare) {
      const glareEl = card.querySelector(".tilt-glare") as HTMLElement;
      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle at ${(e.clientX - rect.left) / rect.width * 100}% ${(e.clientY - rect.top) / rect.height * 100}%, rgba(255,255,255,0.06), transparent 60%)`;
      }
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {glare && <div className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit] z-10 transition-opacity duration-300" />}
      {children}
    </motion.div>
  );
}

// ─── Animated Scanning Beam ─────────────────────────────────

export function ScanningBeam({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}>
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line"
        style={{ boxShadow: "0 0 8px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.1)" }}
      />
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary-400 to-transparent animate-scan-line"
        style={{ animationDelay: "4s", boxShadow: "0 0 8px rgba(168,85,247,0.3), 0 0 20px rgba(168,85,247,0.1)" }}
      />
    </div>
  );
}

// ─── Typewriter Effect ──────────────────────────────────────

export function TypewriterText({
  texts,
  speed = 50,
  delay = 2000,
  className = "",
}: {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, speed);
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), delay);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-type-pulse text-primary-400">|</span>
    </span>
  );
}

// ─── Floating Orb ───────────────────────────────────────────

export function FloatingOrb({
  color = "from-primary-500/20 to-primary-700/10",
  size = 500,
  className = "",
  blur = "blur-[100px]",
  animation = "animate-orb-drift",
  delay = "0s",
}: {
  color?: string;
  size?: number;
  className?: string;
  blur?: string;
  animation?: string;
  delay?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-gradient-to-br ${color} ${blur} ${animation} ${className}`}
      style={{
        width: size,
        height: size,
        animationDelay: delay,
      }}
    />
  );
}

// ─── Data Equalizer Bars ────────────────────────────────────

export function DataEqualizer({ bars = 12, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-primary-500 to-secondary-500 animate-equalizer"
          style={{
            height: 10 + Math.random() * 30,
            animationDelay: `${i * 0.06}s`,
            animationDuration: `${0.4 + Math.random() * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Video/Animation Reel Component ─────────────────────────

export function AnimatedReel({ className = "" }: { className?: string }) {
  const reelRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={reelRef} className={`relative overflow-hidden ${className}`}>
      <div className="flex animate-ticker gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3 backdrop-blur-sm"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? "rgba(59,130,246,0.6)" : "rgba(168,85,247,0.6)" }}
            />
            <span className="whitespace-nowrap text-xs font-medium text-slate-500">
              {["IRT Analysis", "BKT Modeling", "CAT Adaptive", "Neural Scoring", "Gap Detection", "Cognitive Profiling", "Misconception ID", "Predictive Analytics"][i - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Holographic Badge ──────────────────────────────────────

export function HolographicBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-5 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm animate-hologram ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
      </span>
      {text}
    </div>
  );
}
