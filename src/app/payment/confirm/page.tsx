"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Coins } from "lucide-react";

function PaymentConfirmContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");
  const amount = params.get("amount");
  const [verifying, setVerifying] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string; coins?: number } | null>(null);

  useEffect(() => {
    if (!reference) {
      setVerifying(false);
      setResult({ success: false, message: "No payment reference found." });
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (data.status && data.data?.status === "success") {
          const paidAmount = Number(data.data.amount || amount || 0);
          const planCode = data.data.metadata?.plan_code;
          let coins = 0;
          if (planCode === "coins_bundle_20") {
            coins = 20;
          } else {
            coins = Math.floor(paidAmount / 2000);
          }
          setResult({ success: true, message: `Your ${coins} coins have been added to your wallet.`, coins });
        } else {
          setResult({ success: false, message: "Payment could not be verified. Please try again." });
        }
      } catch {
        setResult({ success: false, message: "Verification failed. Please try again." });
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [reference, amount]);

  if (!reference) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-error" />
          <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Invalid Payment</h1>
          <p className="mt-2 text-sm text-neutral-500">No payment reference found.</p>
          <Button className="mt-6 w-full" onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center animate-fade-in">
        {verifying ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-primary-500 animate-spin" />
            <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Verifying Payment...</h1>
            <p className="mt-2 text-sm text-neutral-500">Please wait while we confirm your payment.</p>
          </>
        ) : result?.success ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Coins Added!</h1>
            <p className="mt-2 text-sm text-neutral-500">{result.message}</p>
            {result.coins && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-950">
                <Coins className="h-5 w-5 text-amber-600" />
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">+{result.coins} coins</span>
              </div>
            )}
            <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
              Reference: {reference}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/student/reports")}>
                View Reports
              </Button>
              <Button className="flex-1" onClick={() => router.push("/student")}>Go to Dashboard</Button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-error" />
            <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Payment Failed</h1>
            <p className="mt-2 text-sm text-neutral-500">{result?.message || "Your payment could not be processed."}</p>
            <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
              Reference: {reference}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/pricing")}>Try Again</Button>
              <Button className="flex-1" onClick={() => router.push("/")}>Go Home</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentConfirmPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-4"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>}>
      <PaymentConfirmContent />
    </Suspense>
  );
}
