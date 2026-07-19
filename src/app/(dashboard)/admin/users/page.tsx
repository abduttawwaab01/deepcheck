"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Mail, Shield, Ban, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const demoUsers = [
  { id: "U001", name: "Dr. Adeyemi", email: "adeyemi@gracefield.edu", role: "admin", status: "active", created: "12 Jan 2026", assessments: 45 },
  { id: "U002", name: "Mrs. Okafor", email: "okafor@gracefield.edu", role: "teacher", status: "active", created: "23 Feb 2026", assessments: 23 },
  { id: "U003", name: "Mr. Uche", email: "uche@excelcollege.edu", role: "teacher", status: "active", created: "05 Mar 2026", assessments: 18 },
  { id: "U004", name: "Amara Eze", email: "amara@parent.com", role: "parent", status: "active", created: "14 Mar 2026", assessments: 5 },
  { id: "U005", name: "Chidi Okonkwo", email: "chidi@parent.com", role: "parent", status: "inactive", created: "02 Apr 2026", assessments: 2 },
  { id: "U006", name: "Adeola Ogunlesi", email: "adeola@school.edu.ng", role: "student", status: "active", created: "15 Apr 2026", assessments: 12 },
  { id: "U007", name: "Zainab Abdullahi", email: "zainab@school.edu.ng", role: "student", status: "active", created: "20 Apr 2026", assessments: 8 },
  { id: "U008", name: "Emeka Nwosu", email: "emeka@excel.edu.ng", role: "student", status: "active", created: "01 May 2026", assessments: 6 },
];

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  parent: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800",
  suspended: "bg-error/10 text-error",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<typeof demoUsers[0] | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const filtered = demoUsers.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  const handleDelete = () => {
    if (confirmText !== deleteTarget?.name) return;
    // In real app: trpc.admin.deleteUser.useMutation()
    setDeleteTarget(null);
    setConfirmText("");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage all platform users. Delete accounts with caution.</p>
      </div>

      {/* Search + role filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {["all", "admin", "teacher", "student", "parent"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                roleFilter === r
                  ? "bg-primary-600 text-white"
                  : "glass text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Name</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 md:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Role</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 lg:table-cell">Assessments</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50/50 dark:border-neutral-900 dark:hover:bg-neutral-900/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-[11px] font-bold text-white">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-neutral-400 md:hidden">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-500 md:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", roleColors[u.role])}>
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", statusColors[u.status])}>
                      {u.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-500 lg:table-cell">{u.assessments}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800" title="Email">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-warning dark:hover:bg-neutral-800" title="Suspend">
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(u); setConfirmText(""); }}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-error dark:hover:bg-neutral-800"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-neutral-500">No users found</div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle className="h-5 w-5 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Delete User</h3>
                <p className="text-sm text-neutral-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-950">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>{deleteTarget.name}</strong> ({deleteTarget.email})
              </p>
              <p className="mt-1 text-xs text-neutral-500">Role: {deleteTarget.role} | Assessments: {deleteTarget.assessments}</p>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Type <strong className="text-error">{deleteTarget.name}</strong> to confirm deletion:
            </p>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-error dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              placeholder={deleteTarget.name}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                className="flex-1"
                disabled={confirmText !== deleteTarget.name}
                onClick={handleDelete}
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
