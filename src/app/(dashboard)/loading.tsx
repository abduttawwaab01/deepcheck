export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        <div className="space-y-2 text-center">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-48 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}
