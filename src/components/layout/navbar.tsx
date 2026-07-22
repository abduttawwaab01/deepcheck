"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Sparkles, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/for-schools", label: "For Schools" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-primary-500/5"
          : "bg-gradient-to-b from-slate-950/60 to-transparent"
      )}
    >
      {/* Top scanning line */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400/40 to-transparent" />
      )}

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-500 text-xs font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-500 group-hover:shadow-primary-500/40 group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[5px] font-bold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">AI</div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Deep Check
          </span>
          {scrolled && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium text-emerald-400">Live</span>
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300 group-hover:w-3/4" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-xl border border-white/10 bg-white/5 p-3 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          )}

          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register" className="hidden sm:block">
            <Button
              size="sm"
              className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white border-0 shadow-lg shadow-primary-500/20 group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Button>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/60 md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/auth/register" onClick={() => setIsOpen(false)} className="mt-2">
              <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0">
                Get Started Free
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
