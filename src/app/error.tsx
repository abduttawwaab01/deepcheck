"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-900">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10">
          <AlertTriangle className="h-7 w-7 text-error" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Something went wrong</h2>
        <p className="mt-2 text-sm text-neutral-500">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-neutral-400">Error: {error.digest}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Link href="/">
            <Button><Home className="mr-2 h-4 w-4" /> Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
