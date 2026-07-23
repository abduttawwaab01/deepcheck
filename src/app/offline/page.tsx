import Link from "next/link";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "You're Offline — Deep Check",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <WifiOff className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">You&apos;re Offline</h1>
        <p className="mt-2 text-sm text-slate-400">
          Deep Check needs an internet connection to load this page. Your cached data is still available.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-600">
          Once connected, your data will sync automatically.
        </p>
      </div>
    </div>
  );
}