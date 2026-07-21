"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

const plans = [
  {
    name: "Free", price: "₦0", desc: "For individual students exploring Deep Check",
    features: ["1 Basic assessment", "Basic report card", "View sample deep report", "Email support"],
    cta: "Get Started", href: "/auth/register?plan=free", popular: false,
  },
  {
    name: "Deep Report", price: "₦3,000", desc: "Per assessment — unlock your full potential", amount: 3000, planCode: "deep_report",
    features: [
      "Full 35-question adaptive assessment",
      "Comprehensive Deep Report (PDF)",
      "Personalized study recommendations",
      "Concept-level diagnostic breakdown",
      "Peer percentile comparison",
      "7-day learning plan",
      "Email & chat support",
    ],
    cta: "Buy a Deep Report", href: "/auth/register?plan=deep", popular: true,
  },
  {
    name: "Parent Bundle", price: "₦10,000", desc: "5 Deep Reports — perfect for 1 term", amount: 10000, planCode: "parent_bundle",
    features: [
      "5 Deep Report credits",
      "All Deep Report features",
      "Track progress across assessments",
      "Priority email support",
    ],
    cta: "Buy Parent Bundle", href: "/auth/register?plan=bundle", popular: false,
  },
  {
    name: "School Bulk", price: "₦150,000", desc: "Per school per term — unlimited everything",
    features: [
      "Unlimited student accounts",
      "Unlimited assessments",
      "Deep Reports for every student",
      "Real-time admin dashboard",
      "Bulk roster upload",
      "Teacher & parent portals",
      "WASSCE/NECO-aligned question bank",
      "Anti-cheating tools",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact Sales", href: "/for-schools", popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planCode: string, amount: number) => {
    setLoading(planCode);
    try {
      // TODO: Get the actual user email from session. For now, use a placeholder.
      // This endpoint requires auth; if user isn't logged in, they should be redirected to login first.
      const email = "user@example.com";
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: amount * 100, planCode }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.error) {
        console.error("Payment init failed:", data.error);
      }
    } catch (e) {
      console.error("Payment init error:", e);
    }
    setLoading(null);
  };

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">Simple Pricing</h1>
          <p className="mx-auto mt-2 max-w-xl text-neutral-500">
            Start free, upgrade when you need more. No hidden fees — pay as you grow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass relative rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                plan.popular ? "ring-2 ring-primary-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-neutral-500">{plan.desc}</p>

              <div className="mt-4">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">{plan.price}</span>
              </div>

              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {"amount" in plan && plan.amount && plan.planCode ? (
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                    disabled={loading !== null}
                    onClick={() => handlePurchase(plan.planCode, plan.amount)}
                  >
                    {loading === plan.planCode ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {loading === plan.planCode ? "Processing..." : plan.cta}
                  </Button>
                ) : (
                  <Link href={plan.href}>
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
