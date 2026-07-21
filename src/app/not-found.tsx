import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6 dark:bg-neutral-900">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <FileQuestion className="h-7 w-7 text-neutral-400" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Page not found</h2>
        <p className="mt-2 text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
