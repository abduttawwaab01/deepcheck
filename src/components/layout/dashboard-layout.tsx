"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardCheck, BarChart3, Settings, LogOut,
  ChevronLeft, Bell, Menu, X, User, School, Users, BookOpen,
  FileText, Wallet, GraduationCap, HeartHandshake, Sparkles,
  Brain, Target, ShieldCheck, Shield, Sun, Moon,
} from "lucide-react";

const portalConfig: Record<string, { href: string; label: string; icon: any }[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/questions", label: "Question Bank", icon: BookOpen },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/schools", label: "Schools", icon: School },
    { href: "/admin/reports", label: "Reports Queue", icon: FileText },
    { href: "/admin/payments", label: "Payments", icon: Wallet },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
  school_admin: [
    { href: "/school", label: "Dashboard", icon: LayoutDashboard },
    { href: "/school/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/school/teachers", label: "Teachers", icon: Users },
    { href: "/school/students", label: "Students", icon: GraduationCap },
    { href: "/school/assessment", label: "School Assessment", icon: ShieldCheck },
    { href: "/school/reports", label: "Reports", icon: FileText },
    { href: "/school/settings", label: "Settings", icon: Settings },
  ],
  student: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/assessments", label: "Assessments", icon: ClipboardCheck },
    { href: "/student/practice", label: "Practice", icon: Target },
    { href: "/student/reviews", label: "Review Schedule", icon: Brain },
    { href: "/student/reports", label: "Reports", icon: BarChart3 },
    { href: "/student/settings", label: "Settings", icon: Settings },
  ],
  teacher: [
    { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/assessment", label: "Take Assessment", icon: ClipboardCheck },
    { href: "/teacher/analytics", label: "Item Analysis", icon: Brain },
    { href: "/teacher/insights", label: "Class Insights", icon: Shield },
    { href: "/teacher/reports", label: "My Reports", icon: BarChart3 },
    { href: "/teacher/settings", label: "Settings", icon: Settings },
  ],
  parent: [
    { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
    { href: "/parent/children", label: "My Children", icon: HeartHandshake },
    { href: "/parent/reports", label: "Reports", icon: BarChart3 },
    { href: "/parent/settings", label: "Settings", icon: Settings },
  ],
};

const roleColors: Record<string, string> = {
  admin: "from-rose-500 to-orange-500",
  school_admin: "from-blue-500 to-indigo-500",
  teacher: "from-emerald-500 to-teal-500",
  student: "from-primary-500 to-secondary-500",
  parent: "from-violet-500 to-purple-500",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const role = (session?.user as any)?.role as string | undefined;

  useEffect(() => { setMounted(true); }, []);
  const links = role ? portalConfig[role] || portalConfig.student : portalConfig.student;
  const gradient = role ? roleColors[role] || roleColors.student : roleColors.student;

  useEffect(() => {
    if (!role) return;
    const base = pathname.split("/")[1];
    if (role !== base && !pathname.startsWith(`/${role}`)) {
      router.push(`/${role}`);
    }
  }, [role, pathname, router]);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          <Link href={role ? `/${role}` : "/"} className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white", gradient)}>
              DC
            </div>
            <span className="font-bold text-neutral-900 dark:text-white">Deep Check</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", gradient)}>
              {(session?.user as any)?.name?.charAt(0) || "U"}
            </div>
            <div className="text-sm">
              <div className="font-medium text-neutral-900 dark:text-white truncate max-w-[160px]">{(session?.user as any)?.name || "User"}</div>
              <div className="text-xs capitalize text-neutral-500">{role?.replace("_", " ") || "Guest"}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <Link
            href="/auth/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800">
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            )}
            <button className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
            </button>
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", gradient)}>
              {(session?.user as any)?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
