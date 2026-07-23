"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Loader2, Coins, Landmark, Sparkles, Ban } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export default function PricingPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  const dashboardHref = role ? `/${role}` : "/student";

  const [loading, setLoading] = useState<string | null>(null);
  const [customCoins, setCustomCoins] = useState(5);
  const [senderName, setSenderName] = useState("");
  const [bankTransferSent, setBankTransferSent] = useState(false);
  const [btLoading, setBtLoading] = useState(false);
  const [btError, setBtError] = useState("");
  const [btResultCoins, setBtResultCoins] = useState(0);

  const { data: pricing } = trpc.public.getPricingConfig.useQuery();
  const { data: bankDetails } = trpc.public.getBankDetails.useQuery();
  const schoolInfo = trpc.student.getSchoolInfo.useQuery();

  const pricePerCoin = pricing?.pricePerCoin || 2000;
  const coinsPerReport = pricing?.coinsPerReport || 1;
  const bundle20Price = pricing?.bundle20Price || 35000;
  const bundle20Coins = pricing?.bundle20Coins || 20;

  const handlePaystack = async (planCode: string, amount: number) => {
    setLoading(planCode);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const email = session?.user?.email;
      if (!email) { window.location.href = "/auth/login"; return; }
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, planCode }),
      });
      const data = await res.json();
      if (data.authorization_url) window.location.href = data.authorization_url;
      else if (data.error) console.error("Payment init failed:", data.error);
    } catch (e) { console.error("Payment init error:", e); }
    setLoading(null);
  };

  const submitBT = trpc.public.submitBankTransfer.useMutation();

  const handleBankTransfer = async (plan: "custom" | "bundle") => {
    if (!senderName.trim()) { setBtError("Please enter the sender's name"); return; }
    setBtLoading(true); setBtError("");
    try {
      const amount = plan === "bundle" ? bundle20Price : customCoins * pricePerCoin;
      const coins = plan === "bundle" ? bundle20Coins : customCoins;
      const data = await submitBT.mutateAsync({
        amount, coinsRequested: coins, senderName: senderName.trim(),
      });
      if (data.success) { setBtResultCoins(coins); setBankTransferSent(true); }
      else setBtError(data.message || "Failed to submit");
    } catch { setBtError("Failed to submit bank transfer. Please ensure your account is active and try again."); }
    setBtLoading(false);
  };

  if (schoolInfo.isLoading) return null;

  if (schoolInfo.data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
            <Ban className="h-8 w-8 text-warning" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">School-Account Restricted</h1>
          <p className="mt-3 text-sm text-neutral-500">
            You are linked to <strong>{schoolInfo.data.name}</strong>. You cannot purchase coins directly.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Your school has <strong>{schoolInfo.data.deepReportCredits} credits</strong> remaining.
            Please contact your school administrator if you need more credits.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href={dashboardHref}><Button variant="outline" className="flex-1">Go to Dashboard</Button></Link>
            <Link href="/parent/reports"><Button className="flex-1">View Reports</Button></Link>
          </div>
        </div>
      </main>
    );
  }

  if (bankTransferSent) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <Sparkles className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Transfer Submitted!</h1>
          <p className="mt-3 text-sm text-neutral-500">
            Your bank transfer request for <strong>{btResultCoins} coins</strong> has been submitted.
            An admin will confirm your payment and credit your account shortly.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setBankTransferSent(false); setSenderName(""); }}>Submit Another</Button>
            <Link href={dashboardHref}><Button className="flex-1">Go to Dashboard</Button></Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25">
            <Coins className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl dark:text-white">Buy Coins</h1>
          <p className="mx-auto mt-2 max-w-xl text-neutral-500">
            Each deep report costs <span className="font-semibold text-amber-600">{coinsPerReport} coin{coinsPerReport > 1 ? "s" : ""}</span>.
            Buy once, use anytime — coins never expire.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Plan 1: Custom Amount */}
          <div className="glass relative rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Custom Coins</h3>
                <p className="text-xs text-neutral-500">Buy any amount you need</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">₦{pricePerCoin.toLocaleString()}</span>
                <span className="text-sm text-neutral-500">per coin</span>
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                {coinsPerReport} coin{coinsPerReport > 1 ? "s" : ""} per deep report
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">How many coins?</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setCustomCoins(Math.max(1, customCoins - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 text-lg font-bold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">-</button>
                <input type="number" min={1} max={1000}
                  className="w-full max-w-24 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-center text-lg font-bold outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={customCoins} onChange={(e) => setCustomCoins(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setCustomCoins(customCoins + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 text-lg font-bold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">+</button>
              </div>
              <div className="mt-3 text-lg font-bold text-neutral-900 dark:text-white">
                Total: ₦{(customCoins * pricePerCoin).toLocaleString()}
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">{customCoins} Deep Report coin{customCoins > 1 ? "s" : ""}</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Full 35-question adaptive assessment</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Comprehensive Deep Report (PDF)</span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <Button variant="default" className="w-full" disabled={loading !== null}
                onClick={() => handlePaystack("coins_custom", customCoins * pricePerCoin * 100)}>
                {loading === "coins_custom" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading === "coins_custom" ? "Processing..." : "Pay with Paystack"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-neutral-200 dark:border-neutral-700" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-neutral-400 dark:bg-neutral-950">or pay via bank transfer</span></div>
              </div>

              <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 dark:border-primary-900 dark:bg-primary-950/50">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                  <Landmark className="h-4 w-4" /> Bank Transfer Details
                </div>
                <div className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>Account Name: <strong>{bankDetails?.accountName || "Odebunmi Tawwab"}</strong></p>
                  <p>Account Number: <strong>{bankDetails?.accountNumber || "9152929772"}</strong></p>
                  <p>Bank: <strong>{bankDetails?.bankName || "Palmpay"}</strong></p>
                  <p className="mt-1 text-xs">Amount: <strong>₦{(customCoins * pricePerCoin).toLocaleString()}</strong></p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Sender&apos;s Full Name (for confirmation)</label>
                <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  placeholder="Enter the name you sent from" />
              </div>
              {btError && <p className="text-xs text-error">{btError}</p>}
              <Button variant="outline" className="w-full gap-2" onClick={() => handleBankTransfer("custom")} disabled={btLoading}>
                {btLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Landmark className="h-4 w-4" />}
                {btLoading ? "Submitting..." : "I've Sent the Transfer"}
              </Button>
            </div>
          </div>

          {/* Plan 2: 20 Coin Bundle */}
          <div className="glass relative rounded-2xl p-6 ring-2 ring-primary-500 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-semibold text-white">
              Best Value
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Bundle 20 Coins</h3>
                <p className="text-xs text-neutral-500">Best value for families</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">20</span>
                <span className="text-sm font-medium text-amber-600">coins</span>
              </div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white">₦{bundle20Price.toLocaleString()}</div>
              <div className="text-xs text-neutral-400">
                ₦{Math.round(bundle20Price / bundle20Coins).toLocaleString()} per coin &middot; Save {Math.round((1 - bundle20Price / (bundle20Coins * pricePerCoin)) * 100)}%
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">20 Deep Report coins</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Full 35-question adaptive assessment</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Comprehensive Deep Report (PDF)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Track progress across assessments</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Peer percentile comparison</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span className="text-neutral-600 dark:text-neutral-400">Priority email support</span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <Button variant="default" className="w-full" disabled={loading !== null}
                onClick={() => handlePaystack("coins_bundle_20", bundle20Price * 100)}>
                {loading === "coins_bundle_20" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading === "coins_bundle_20" ? "Processing..." : "Buy Bundle with Paystack"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-neutral-200 dark:border-neutral-700" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-neutral-400 dark:bg-neutral-950">or pay via bank transfer</span></div>
              </div>

              <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 dark:border-primary-900 dark:bg-primary-950/50">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                  <Landmark className="h-4 w-4" /> Bank Transfer Details
                </div>
                <div className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>Account Name: <strong>{bankDetails?.accountName || "Odebunmi Tawwab"}</strong></p>
                  <p>Account Number: <strong>{bankDetails?.accountNumber || "9152929772"}</strong></p>
                  <p>Bank: <strong>{bankDetails?.bankName || "Palmpay"}</strong></p>
                  <p className="mt-1 text-xs">Amount: <strong>₦{bundle20Price.toLocaleString()}</strong></p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Sender&apos;s Full Name (for confirmation)</label>
                <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  placeholder="Enter the name you sent from" />
              </div>
              {btError && <p className="text-xs text-error">{btError}</p>}
              <Button variant="outline" className="w-full gap-2" onClick={() => handleBankTransfer("bundle")} disabled={btLoading}>
                {btLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Landmark className="h-4 w-4" />}
                {btLoading ? "Submitting..." : "I've Sent the Transfer"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            Need a custom plan for your school?{" "}
            <Link href="/for-schools" className="font-medium text-primary-600 hover:underline">Contact Sales</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
