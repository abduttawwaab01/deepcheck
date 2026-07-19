"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Shield, Crown } from "lucide-react";

const demoSchools = [
  { id: "SCH001", name: "Gracefield International College", city: "Lagos", students: 1240, teachers: 68, verified: true, tier: "premium" },
  { id: "SCH002", name: "Excel College", city: "Abuja", students: 980, teachers: 52, verified: true, tier: "premium" },
  { id: "SCH003", name: "Royal Academy", city: "Port Harcourt", students: 720, teachers: 41, verified: false, tier: "free" },
  { id: "SCH004", name: "Bright Future Schools", city: "Ibadan", students: 1500, teachers: 80, verified: true, tier: "premium" },
  { id: "SCH005", name: "Golden Star Academy", city: "Enugu", students: 450, teachers: 28, verified: false, tier: "free" },
  { id: "SCH006", name: "Summit College", city: "Kano", students: 1100, teachers: 60, verified: true, tier: "standard" },
];

export default function AdminSchoolsPage() {
  const { data: _ } = trpc.admin.getSchools.useQuery();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Schools Overview</h1>
        <span className="text-xs text-neutral-400">{demoSchools.length} schools</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoSchools.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">{s.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin className="h-3 w-3" />
                  {s.city}
                </div>
              </div>
              {s.verified ? (
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
                s.tier === "premium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" :
                s.tier === "standard" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
              }`}>
                <Crown className="h-3 w-3" /> {s.tier}
              </span>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
