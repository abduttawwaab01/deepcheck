"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Shield, Crown } from "lucide-react";

export default function AdminSchoolsPage() {
  const { data: schools } = trpc.admin.getSchools.useQuery();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Schools Overview</h1>
        <span className="text-xs text-neutral-400">{schools?.length || 0} schools</span>
      </div>

      {!schools ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.length === 0 ? <div className="col-span-full py-8 text-center text-sm text-neutral-500">No schools found</div> :
          schools.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{s.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" />
                    {s.city}
                  </div>
                </div>
                {s.status === "verified" ? (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Pending</span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {s.students}</div>
                <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {s.teachers}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                  s.subscription === "premium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" :
                  s.subscription === "free" ? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                }`}>
                  <Crown className="h-3 w-3" /> {s.subscription}
                </span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
