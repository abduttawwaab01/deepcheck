"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[Root Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-900">
      <div className="glass max-w-lg rounded-2xl p-8 text-center">
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

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {showDetails ? "Hide details" : "Show details"}
        </button>

        {showDetails && (
          <div className="mt-3 max-h-48 overflow-auto rounded-lg bg-neutral-100 p-3 text-left dark:bg-neutral-800">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="mt-1 whitespace-pre-wrap text-[10px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                {error.stack}
              </pre>
            )}
          </div>
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
