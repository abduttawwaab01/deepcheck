"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Heart } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "For Schools", href: "/for-schools" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/tos" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
    { label: "API Docs", href: "/docs" },
    { label: "System Status", href: "/status" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden bg-slate-950">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Newsletter Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-primary-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-primary-400" />
                Stay Connected
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Stay Ahead of the Curve</h3>
              <p className="mt-2 text-sm text-slate-400">Get weekly insights on learning diagnostics and education technology</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm transition-all duration-300 focus:border-primary-500/50 focus:bg-white/10"
                />
              </div>
              <Button className="shrink-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30">
                Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Deep Check</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Deep Learning Diagnostic Intelligence Platform. Uncovering every hidden gap before the next class.
            </p>

            <div className="mt-6 flex items-center gap-4 text-sm text-slate-600">
              <Heart className="h-4 w-4 text-primary-400" />
              <span>Made with care for Nigerian education</span>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-all duration-300 hover:text-white hover:pl-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Deep Check. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
