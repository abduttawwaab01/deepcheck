"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Search, Mail, Shield, Ban, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.getAllUsers.useQuery({});
  const deleteUser = trpc.admin.deleteUser.useMutation({ onSuccess: () => { setDeleteTarget(null); setConfirmText(""); utils.admin.getAllUsers.invalidate(); } });
  const toggleStatus = trpc.admin.toggleUserStatus.useMutation({ onSuccess: () => utils.admin.getAllUsers.invalidate() });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [confirmText, setConfirmText] = useState("");

  const allUsers = data?.items || [];
  const filtered = allUsers.filter((u: any) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && !u.roleNames?.includes(roleFilter)) return false;
    return true;
  });

  const handleDelete = () => {
    if (confirmText !== `${deleteTarget.firstName} ${deleteTarget.lastName}` || !deleteTarget) return;
    deleteUser.mutate({ userId: deleteTarget.id });
    setDeleteTarget(null);
    setConfirmText("");
  };

  const handleToggleStatus = (user: any) => {
    toggleStatus.mutate({ userId: user.id, isActive: !user.isActive });
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
      {isLoading ? <div className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Name</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Role</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any) => (
                  <tr key={u.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50/50 dark:border-neutral-900 dark:hover:bg-neutral-900/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-[11px] font-bold text-white">
                          {`${u.firstName} ${u.lastName}`.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{`${u.firstName} ${u.lastName}`}</p>
                          <p className="text-xs text-neutral-400 md:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-neutral-500 md:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", roleColors[u.roleNames?.[0] || "student"])}>
                        {u.roleNames?.[0] || "student"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", statusColors[u.isActive ? "active" : "inactive"])}>
                        {u.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800" title="Email">
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleToggleStatus(u)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-warning dark:hover:bg-neutral-800" title={u.isActive ? "Suspend" : "Activate"}>
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
      )}

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
                <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong> ({deleteTarget.email})
              </p>
              <p className="mt-1 text-xs text-neutral-500">Role: {deleteTarget.roleNames?.[0] || "N/A"}</p>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Type <strong className="text-error">{deleteTarget.firstName} {deleteTarget.lastName}</strong> to confirm deletion:
            </p>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-error dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              placeholder={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                className="flex-1"
                disabled={confirmText !== `${deleteTarget.firstName} ${deleteTarget.lastName}`}
                onClick={handleDelete}
                loading={deleteUser.isPending}
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
