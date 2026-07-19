import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorParam } = await searchParams;
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The verification link is invalid or has expired.",
    Default: "An authentication error occurred.",
  };

  const error = errorParam || "Default";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-8 w-8 text-error" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Authentication Error</h1>
        <p className="mt-2 text-sm text-neutral-500">{errorMessages[error] || errorMessages.Default}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/auth/login"><Button className="w-full">Try Again</Button></Link>
          <Link href="/"><Button variant="ghost" className="w-full">Go Home</Button></Link>
        </div>
      </div>
    </div>
  );
}
