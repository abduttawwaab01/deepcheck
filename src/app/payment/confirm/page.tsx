"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

function PaymentConfirmContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");
  const amount = params.get("amount");
  const status = params.get("status") || "success";

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

  const isSuccess = status === "success";

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center animate-fade-in">
        {isSuccess ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-error" />
        )}
        <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {isSuccess
            ? `Your payment of ₦${amount ? (Number(amount) / 100).toLocaleString() : "0"} has been received. Your credits have been added.`
            : "Your payment could not be processed. Please try again."}
        </p>
        <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
          Reference: {reference}
        </div>
        <div className="mt-6 flex gap-3">
          {isSuccess && (
            <Button variant="outline" className="flex-1" onClick={() => router.push("/student/reports")}>
              View Reports
            </Button>
          )}
          <Button className="flex-1" onClick={() => router.push("/")}>Go to Dashboard</Button>
        </div>
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
