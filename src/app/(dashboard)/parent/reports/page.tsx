"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { FileText, Sparkles, Eye, AlertCircle, User } from "lucide-react";

const categoryStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  weak: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  developing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  competent: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  strong: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  mastered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export default function ParentReportsPage() {
  const { data: children } = trpc.parent.getChildren.useQuery();
  const requestDeep = trpc.parent.requestDeepReport.useMutation();

  if (!children) return <div className="animate-fade-in space-y-4">{[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Reports Hub</h1>
        <p className="mt-1 text-sm text-neutral-500">View reports and request deep analysis for each child</p>
      </div>

      {children.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-8 text-center">
          <FileText className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No children linked. Add a child first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.id} className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-bold text-white">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">{child.name}</h2>
                  <p className="text-xs text-neutral-500">{child.assessments} assessment(s)</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Academic Assessment</p>
                    <p className="text-xs text-neutral-500">Last active: {formatDate(child.lastActive)}</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => requestDeep.mutate({ childId: child.id, instanceId: child.id })}
                    loading={requestDeep.isPending}
                  >
                    <Sparkles className="h-3.5 w-3.5" />Request Deep Report
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
