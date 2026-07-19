"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

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
    <footer className="relative border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Newsletter */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h3 className="text-xl font-bold text-white">Stay Ahead of the Curve</h3>
              <p className="mt-1 text-sm text-white/80">Get weekly insights on learning diagnostics and education technology</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-10 py-2.5 text-sm text-white placeholder-white/60 outline-none backdrop-blur-sm focus:border-white/40"
                />
              </div>
              <Button className="shrink-0 bg-white text-primary-700 hover:bg-white/90">
                Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">DC</div>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">Deep Check</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Deep Learning Diagnostic Intelligence Platform. Uncovering every hidden gap before the next class.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{category}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} Deep Check. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
